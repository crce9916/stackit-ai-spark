
-- StackIt Q&A Platform Database Schema
-- Run this script in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Create custom types
CREATE TYPE user_role AS ENUM ('guest', 'user', 'moderator', 'admin');
CREATE TYPE question_status AS ENUM ('active', 'closed', 'flagged', 'deleted');
CREATE TYPE notification_type AS ENUM ('answer', 'vote', 'follow', 'accepted', 'mention', 'system');
CREATE TYPE vote_type AS ENUM ('up', 'down');

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  location TEXT,
  website TEXT,
  role user_role DEFAULT 'user',
  reputation INTEGER DEFAULT 0,
  questions_count INTEGER DEFAULT 0,
  answers_count INTEGER DEFAULT 0,
  votes_received INTEGER DEFAULT 0,
  badges JSONB DEFAULT '[]',
  is_verified BOOLEAN DEFAULT FALSE,
  is_banned BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  usage_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status question_status DEFAULT 'active',
  tags TEXT[] DEFAULT '{}',
  views_count INTEGER DEFAULT 0,
  votes_count INTEGER DEFAULT 0,
  answers_count INTEGER DEFAULT 0,
  accepted_answer_id UUID,
  is_featured BOOLEAN DEFAULT FALSE,
  bounty_amount INTEGER DEFAULT 0,
  ai_generated BOOLEAN DEFAULT FALSE,
  quality_score FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  votes_count INTEGER DEFAULT 0,
  is_accepted BOOLEAN DEFAULT FALSE,
  ai_generated BOOLEAN DEFAULT FALSE,
  quality_score FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  target_id UUID NOT NULL, -- Can reference questions or answers
  target_type TEXT NOT NULL CHECK (target_type IN ('question', 'answer')),
  vote_type vote_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, target_id, target_type)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  target_id UUID NOT NULL, -- Can reference questions or answers
  target_type TEXT NOT NULL CHECK (target_type IN ('question', 'answer')),
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id), -- For nested comments
  votes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id),
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  target_id UUID, -- Reference to question, answer, etc.
  target_type TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('question', 'answer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, target_id, target_type)
);

-- Create following table
CREATE TABLE IF NOT EXISTS follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Create moderation_logs table
CREATE TABLE IF NOT EXISTS moderation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  moderator_id UUID REFERENCES profiles(id),
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL,
  action TEXT NOT NULL,
  reason TEXT,
  ai_suggested BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ai_interactions table
CREATE TABLE IF NOT EXISTS ai_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  interaction_type TEXT NOT NULL, -- 'tag_suggestion', 'question_improvement', 'answer_generation'
  input_data JSONB,
  output_data JSONB,
  quality_rating INTEGER, -- 1-5 rating from user
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for accepted_answer_id
ALTER TABLE questions ADD CONSTRAINT fk_accepted_answer 
  FOREIGN KEY (accepted_answer_id) REFERENCES answers(id);

-- Create indexes for better performance
CREATE INDEX idx_questions_author ON questions(author_id);
CREATE INDEX idx_questions_status ON questions(status);
CREATE INDEX idx_questions_created_at ON questions(created_at DESC);
CREATE INDEX idx_questions_tags ON questions USING GIN(tags);
CREATE INDEX idx_answers_question ON answers(question_id);
CREATE INDEX idx_answers_author ON answers(author_id);
CREATE INDEX idx_votes_target ON votes(target_id, target_type);
CREATE INDEX idx_votes_user ON votes(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, read);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_tags_name ON tags(name);

-- Create functions for updating counts
CREATE OR REPLACE FUNCTION update_question_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update answers count
    UPDATE questions 
    SET answers_count = answers_count + 1,
        updated_at = NOW()
    WHERE id = NEW.question_id;
    
    -- Update user's answers count
    UPDATE profiles 
    SET answers_count = answers_count + 1
    WHERE id = NEW.author_id;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Update answers count
    UPDATE questions 
    SET answers_count = answers_count - 1,
        updated_at = NOW()
    WHERE id = OLD.question_id;
    
    -- Update user's answers count
    UPDATE profiles 
    SET answers_count = answers_count - 1
    WHERE id = OLD.author_id;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Update vote count on target
    IF NEW.target_type = 'question' THEN
      UPDATE questions 
      SET votes_count = votes_count + CASE WHEN NEW.vote_type = 'up' THEN 1 ELSE -1 END
      WHERE id = NEW.target_id;
    ELSIF NEW.target_type = 'answer' THEN
      UPDATE answers 
      SET votes_count = votes_count + CASE WHEN NEW.vote_type = 'up' THEN 1 ELSE -1 END
      WHERE id = NEW.target_id;
    END IF;
    
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    -- Update vote count on target
    IF OLD.target_type = 'question' THEN
      UPDATE questions 
      SET votes_count = votes_count - CASE WHEN OLD.vote_type = 'up' THEN 1 ELSE -1 END
      WHERE id = OLD.target_id;
    ELSIF OLD.target_type = 'answer' THEN
      UPDATE answers 
      SET votes_count = votes_count - CASE WHEN OLD.vote_type = 'up' THEN 1 ELSE -1 END
      WHERE id = OLD.target_id;
    END IF;
    
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_user_question_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles 
    SET questions_count = questions_count + 1
    WHERE id = NEW.author_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles 
    SET questions_count = questions_count - 1
    WHERE id = OLD.author_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_answer_counts
  AFTER INSERT OR DELETE ON answers
  FOR EACH ROW EXECUTE FUNCTION update_question_counts();

CREATE TRIGGER trigger_update_vote_counts
  AFTER INSERT OR DELETE ON votes
  FOR EACH ROW EXECUTE FUNCTION update_vote_counts();

CREATE TRIGGER trigger_update_user_question_count
  AFTER INSERT OR DELETE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_user_question_count();

-- Insert sample tags
INSERT INTO tags (name, description, color) VALUES
('JavaScript', 'Questions about JavaScript programming language', '#F7DF1E'),
('React', 'React.js library and ecosystem questions', '#61DAFB'),
('Python', 'Python programming language questions', '#3776AB'),
('Node.js', 'Server-side JavaScript with Node.js', '#339933'),
('TypeScript', 'TypeScript language and tooling', '#3178C6'),
('CSS', 'Cascading Style Sheets questions', '#1572B6'),
('HTML', 'HyperText Markup Language questions', '#E34F26'),
('Database', 'Database design and query questions', '#336791'),
('API', 'Application Programming Interface questions', '#FF6B35'),
('Authentication', 'User authentication and authorization', '#4CAF50'),
('Performance', 'Code optimization and performance', '#FF9800'),
('Testing', 'Software testing and quality assurance', '#9C27B0'),
('DevOps', 'Development operations and deployment', '#2196F3'),
('Mobile', 'Mobile app development questions', '#FFC107'),
('Web Development', 'General web development topics', '#E91E63');

-- Enable Row Level Security policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: Users can view all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Questions: Everyone can view, authenticated users can create
CREATE POLICY "Questions are viewable by everyone" ON questions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create questions" ON questions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own questions" ON questions FOR UPDATE USING (auth.uid() = author_id);

-- Answers: Everyone can view, authenticated users can create
CREATE POLICY "Answers are viewable by everyone" ON answers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create answers" ON answers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own answers" ON answers FOR UPDATE USING (auth.uid() = author_id);

-- Votes: Users can manage their own votes
CREATE POLICY "Users can view all votes" ON votes FOR SELECT USING (true);
CREATE POLICY "Users can manage own votes" ON votes FOR ALL USING (auth.uid() = user_id);

-- Notifications: Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Comments: Everyone can view, authenticated users can create
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = author_id);

-- Bookmarks: Users can manage their own bookmarks
CREATE POLICY "Users can manage own bookmarks" ON bookmarks FOR ALL USING (auth.uid() = user_id);

-- Follows: Users can manage their own follows
CREATE POLICY "Users can view all follows" ON follows FOR SELECT USING (true);
CREATE POLICY "Users can manage own follows" ON follows FOR ALL USING (auth.uid() = follower_id);

-- Create sample data
-- Note: You'll need to create actual users through Supabase Auth first
-- This is just to show the structure

-- Function to create a user profile after sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('question-images', 'question-images', true);

-- Storage policies
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Question images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'question-images');
CREATE POLICY "Authenticated users can upload question images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'question-images' AND auth.role() = 'authenticated');

-- Refresh the schema
NOTIFY pgrst, 'reload schema';
