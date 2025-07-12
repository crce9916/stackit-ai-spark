
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  TrendingUp,
  Ban,
  CheckCircle,
  XCircle,
  Sparkles
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { analyzeContent } from '@/lib/groq';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    totalAnswers: 0,
    pendingReports: 0,
    spamDetected: 0
  });
  
  const [flaggedContent, setFlaggedContent] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchFlaggedContent();
    fetchRecentActivity();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch various stats
      const [usersRes, questionsRes, answersRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('questions').select('id', { count: 'exact' }),
        supabase.from('answers').select('id', { count: 'exact' })
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalQuestions: questionsRes.count || 0,
        totalAnswers: answersRes.count || 0,
        pendingReports: 0, // Would be from reports table
        spamDetected: 0 // Would be from moderation logs
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const fetchFlaggedContent = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          profiles:author_id(username)
        `)
        .eq('flagged', true)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setFlaggedContent(data || []);
    } catch (error) {
      console.error('Error fetching flagged content:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          profiles:author_id(username)
        `)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      setRecentActivity(data || []);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeContentWithAI = async (content: string, type: 'question' | 'answer') => {
    const analysis = await analyzeContent(content, type);
    return analysis;
  };

  const moderateContent = async (contentId: string, action: 'approve' | 'reject' | 'ban') => {
    try {
      if (action === 'approve') {
        await supabase
          .from('questions')
          .update({ flagged: false, moderated: true })
          .eq('id', contentId);
      } else if (action === 'reject') {
        await supabase
          .from('questions')
          .update({ visible: false, moderated: true })
          .eq('id', contentId);
      }
      
      // Refresh data
      fetchFlaggedContent();
    } catch (error) {
      console.error('Error moderating content:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-sm text-gray-600">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</p>
                  <p className="text-sm text-gray-600">Questions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAnswers}</p>
                  <p className="text-sm text-gray-600">Answers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingReports}</p>
                  <p className="text-sm text-gray-600">Pending Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Ban className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.spamDetected}</p>
                  <p className="text-sm text-gray-600">Spam Detected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Management Tabs */}
        <Tabs defaultValue="flagged" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-blue-100">
            <TabsTrigger value="flagged">Flagged Content</TabsTrigger>
            <TabsTrigger value="recent">Recent Activity</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="flagged" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Flagged Content Requiring Review
                </CardTitle>
              </CardHeader>
              <CardContent>
                {flaggedContent.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No flagged content to review</p>
                ) : (
                  <div className="space-y-4">
                    {flaggedContent.map((item) => (
                      <div key={item.id} className="border border-blue-100 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                            <p className="text-sm text-gray-600">
                              by {item.profiles?.username} • {new Date(item.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="destructive">Flagged</Badge>
                        </div>
                        
                        <p className="text-gray-700 mb-4 line-clamp-2">{item.description}</p>
                        
                        <div className="flex items-center gap-3">
                          <Button
                            size="sm"
                            onClick={() => analyzeContentWithAI(item.description, 'question')}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <Sparkles className="h-4 w-4 mr-1" />
                            AI Analysis
                          </Button>
                          
                          <Button
                            size="sm"
                            onClick={() => moderateContent(item.id, 'approve')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => moderateContent(item.id, 'reject')}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moderateContent(item.id, 'ban')}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Ban User
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-3 border-b border-blue-100 last:border-b-0">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-600">
                          by {item.profiles?.username} • {new Date(item.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {item.tags?.slice(0, 2).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">User management features would be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
