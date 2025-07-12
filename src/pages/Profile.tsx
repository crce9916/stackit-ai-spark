
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, MessageSquare, ThumbsUp, Calendar, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';

const Profile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [userQuestions, setUserQuestions] = useState<any[]>([]);
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
    fetchUserQuestions();
    fetchUserAnswers();
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('author_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUserQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchUserAnswers = async () => {
    try {
      const { data, error } = await supabase
        .from('answers')
        .select('*, questions(title)')
        .eq('author_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUserAnswers(data || []);
    } catch (error) {
      console.error('Error fetching answers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-blue-100">
          <CardHeader>
            <div className="flex items-start gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                  {profile?.username?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                  {profile?.username || 'Anonymous User'}
                </CardTitle>
                <p className="text-gray-600 mb-4">{profile?.bio || 'No bio available'}</p>
                
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {new Date(profile?.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    <span>{profile?.reputation || 0} reputation</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{userQuestions.length}</p>
                  <p className="text-sm text-gray-600">Questions Asked</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <ThumbsUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{userAnswers.length}</p>
                  <p className="text-sm text-gray-600">Answers Given</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{profile?.reputation || 0}</p>
                  <p className="text-sm text-gray-600">Reputation</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Trophy className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {userAnswers.filter(a => a.is_accepted).length}
                  </p>
                  <p className="text-sm text-gray-600">Accepted Answers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Tabs */}
        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-blue-100">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="answers">Answers</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-4">
            {userQuestions.map((question) => (
              <Card key={question.id} className="bg-white/80 backdrop-blur-sm border-blue-100">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors">
                    {question.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{question.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {question.tags?.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(question.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="answers" className="space-y-4">
            {userAnswers.map((answer) => (
              <Card key={answer.id} className="bg-white/80 backdrop-blur-sm border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors">
                      {answer.questions?.title}
                    </h3>
                    {answer.is_accepted && (
                      <Badge className="bg-green-100 text-green-800">Accepted</Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{answer.content}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {answer.votes || 0}
                      </span>
                    </div>
                    <span>{new Date(answer.created_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
