
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xyuqpskapfenamafimxz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5dXFwc2thcGZlbmFtYWZpbXh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2OTc0NDAsImV4cCI6MjA1MjI3MzQ0MH0.gYZlflWjGKshxbA-GInPQaLJIg-yUdWp3VZaRDkShOE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database helper functions
export const insertQuestion = async (questionData: any) => {
  const { data, error } = await supabase
    .from('questions')
    .insert([questionData])
    .select(`
      *,
      profiles:author_id(username, display_name)
    `);
  
  if (error) throw error;
  return data[0];
};

export const getQuestions = async (limit = 20, offset = 0) => {
  const { data, error } = await supabase
    .from('questions')
    .select(`
      *,
      profiles:author_id(username, display_name, avatar_url),
      answers(count)
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  if (error) throw error;
  return data;
};

export const getQuestionById = async (id: string) => {
  const { data, error } = await supabase
    .from('questions')
    .select(`
      *,
      profiles:author_id(username, display_name, avatar_url, reputation),
      answers(
        *,
        profiles:author_id(username, display_name, avatar_url, reputation)
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const insertAnswer = async (answerData: any) => {
  const { data, error } = await supabase
    .from('answers')
    .insert([answerData])
    .select(`
      *,
      profiles:author_id(username, display_name, avatar_url)
    `);
  
  if (error) throw error;
  return data[0];
};

export const voteOnContent = async (voteData: any) => {
  // First, try to upsert the vote
  const { data, error } = await supabase
    .from('votes')
    .upsert([voteData], { onConflict: 'user_id,target_id,target_type' })
    .select();
  
  if (error) throw error;
  return data[0];
};

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const searchQuestions = async (query: string, tags: string[] = []) => {
  let queryBuilder = supabase
    .from('questions')
    .select(`
      *,
      profiles:author_id(username, display_name, avatar_url)
    `);
  
  if (query) {
    queryBuilder = queryBuilder.textSearch('title', query);
  }
  
  if (tags.length > 0) {
    queryBuilder = queryBuilder.overlaps('tags', tags);
  }
  
  const { data, error } = await queryBuilder
    .order('created_at', { ascending: false })
    .limit(50);
  
  if (error) throw error;
  return data;
};

export const getTags = async () => {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('usage_count', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getUserNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select(`
      *,
      profiles:sender_id(username, display_name, avatar_url)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  
  if (error) throw error;
  return data;
};
