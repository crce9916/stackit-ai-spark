
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Eye,
  Calendar,
  Activity,
  Target
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';

const Analytics = () => {
  const [analytics, setAnalytics] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch various analytics data
      const [questionsData, usersData, tagsData, activityData] = await Promise.all([
        fetchQuestionsAnalytics(),
        fetchUsersAnalytics(),
        fetchTagsAnalytics(),
        fetchActivityAnalytics()
      ]);

      setAnalytics({
        questions: questionsData,
        users: usersData,
        tags: tagsData,
        activity: activityData
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestionsAnalytics = async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('created_at, status, views_count, votes_count')
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Process data for charts
    const monthlyData = processMonthlyData(data || []);
    const statusData = processStatusData(data || []);
    
    return {
      total: data?.length || 0,
      monthly: monthlyData,
      byStatus: statusData,
      totalViews: data?.reduce((sum, q) => sum + (q.views_count || 0), 0) || 0,
      totalVotes: data?.reduce((sum, q) => sum + (q.votes_count || 0), 0) || 0
    };
  };

  const fetchUsersAnalytics = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('created_at, reputation, questions_count, answers_count')
      .order('created_at', { ascending: true });

    if (error) throw error;

    const monthlySignups = processMonthlyData(data || []);
    const reputationDistribution = processReputationData(data || []);

    return {
      total: data?.length || 0,
      monthly: monthlySignups,
      reputationDistribution,
      averageReputation: data?.reduce((sum, u) => sum + (u.reputation || 0), 0) / (data?.length || 1) || 0
    };
  };

  const fetchTagsAnalytics = async () => {
    const { data, error } = await supabase
      .from('tags')
      .select('name, usage_count')
      .order('usage_count', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  };

  const fetchActivityAnalytics = async () => {
    // This would be more complex in a real app, tracking daily active users, etc.
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const { data, error } = await supabase
      .from('questions')
      .select('created_at')
      .gte('created_at', last30Days.toISOString());

    if (error) throw error;

    return processDailyActivity(data || []);
  };

  const processMonthlyData = (data: any[]) => {
    const monthlyMap = new Map();
    
    data.forEach(item => {
      const date = new Date(item.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + 1);
    });

    return Array.from(monthlyMap.entries()).map(([month, count]) => ({
      month,
      count
    }));
  };

  const processStatusData = (data: any[]) => {
    const statusMap = new Map();
    
    data.forEach(item => {
      const status = item.status || 'active';
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    });

    return Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      count
    }));
  };

  const processReputationData = (data: any[]) => {
    const ranges = [
      { range: '0-100', min: 0, max: 100 },
      { range: '101-500', min: 101, max: 500 },
      { range: '501-1000', min: 501, max: 1000 },
      { range: '1001+', min: 1001, max: Infinity }
    ];

    return ranges.map(({ range, min, max }) => ({
      range,
      count: data.filter(u => u.reputation >= min && u.reputation <= max).length
    }));
  };

  const processDailyActivity = (data: any[]) => {
    const dailyMap = new Map();
    
    data.forEach(item => {
      const date = new Date(item.created_at).toISOString().split('T')[0];
      dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
    });

    return Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const StatCard = ({ title, value, icon: Icon, change }: any) => (
    <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {change}
              </p>
            )}
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Insights into platform usage and community growth</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Questions"
                value={analytics.questions?.total || 0}
                icon={MessageSquare}
                change="+12% this month"
              />
              <StatCard
                title="Total Users"
                value={analytics.users?.total || 0}
                icon={Users}
                change="+8% this month"
              />
              <StatCard
                title="Total Views"
                value={analytics.questions?.totalViews || 0}
                icon={Eye}
                change="+15% this month"
              />
              <StatCard
                title="Total Votes"
                value={analytics.questions?.totalVotes || 0}
                icon={ThumbsUp}
                change="+20% this month"
              />
            </div>

            <Tabs defaultValue="questions" className="space-y-6">
              <TabsList className="bg-white/80 backdrop-blur-sm border border-blue-100">
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="tags">Tags</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="questions" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
                    <CardHeader>
                      <CardTitle>Questions Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics.questions?.monthly || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
                    <CardHeader>
                      <CardTitle>Questions by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={analytics.questions?.byStatus || []}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ status, count }) => `${status}: ${count}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {(analytics.questions?.byStatus || []).map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
                    <CardHeader>
                      <CardTitle>User Signups Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.users?.monthly || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#10B981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
                    <CardHeader>
                      <CardTitle>Reputation Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.users?.reputationDistribution || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="range" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8B5CF6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="tags" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
                  <CardHeader>
                    <CardTitle>Most Popular Tags</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={analytics.tags || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="usage_count" fill="#F59E0B" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
                  <CardHeader>
                    <CardTitle>Daily Activity (Last 30 Days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={analytics.activity || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#EF4444" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
