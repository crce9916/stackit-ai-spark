
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Star, TrendingUp, Users, Award } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';

const Leaderboard = () => {
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [topContributors, setTopContributors] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      // Top users by reputation
      const { data: topRep, error: repError } = await supabase
        .from('profiles')
        .select('*')
        .order('reputation', { ascending: false })
        .limit(10);

      if (repError) throw repError;
      setTopUsers(topRep || []);

      // Top contributors by questions + answers
      const { data: contributors, error: contError } = await supabase
        .from('profiles')
        .select('*')
        .order('questions_count', { ascending: false })
        .limit(10);

      if (contError) throw contError;
      setTopContributors(contributors || []);

      // Trending users (most active this week)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data: trendingData, error: trendError } = await supabase
        .from('profiles')
        .select('*')
        .gte('last_seen', oneWeekAgo.toISOString())
        .order('reputation', { ascending: false })
        .limit(10);

      if (trendError) throw trendError;
      setTrending(trendingData || []);

    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-amber-600" />;
      default: return <span className="text-lg font-bold text-gray-500">#{rank}</span>;
    }
  };

  const UserCard = ({ user, rank }: { user: any, rank: number }) => (
    <Card className="bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {getRankIcon(rank)}
          </div>
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {user.username?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{user.display_name || user.username}</h3>
            <p className="text-gray-600">@{user.username}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{user.reputation} rep</span>
              </div>
              <div className="text-gray-500">
                {user.questions_count} questions • {user.answers_count} answers
              </div>
            </div>
          </div>
          {user.badges && user.badges.length > 0 && (
            <div className="flex gap-1">
              {user.badges.slice(0, 3).map((badge: any, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Leaderboard</h1>
          <p className="text-gray-600">Celebrating our most valuable community members</p>
        </div>

        <Tabs defaultValue="reputation" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-blue-100">
            <TabsTrigger value="reputation" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Top by Reputation
            </TabsTrigger>
            <TabsTrigger value="contributors" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Top Contributors
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trending This Week
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reputation" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              topUsers.map((user, index) => (
                <UserCard key={user.id} user={user} rank={index + 1} />
              ))
            )}
          </TabsContent>

          <TabsContent value="contributors" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              topContributors.map((user, index) => (
                <UserCard key={user.id} user={user} rank={index + 1} />
              ))
            )}
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              trending.map((user, index) => (
                <UserCard key={user.id} user={user} rank={index + 1} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leaderboard;
