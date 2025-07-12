
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, Hash } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';

const Tags = () => {
  const [tags, setTags] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      // This would require a proper tags aggregation query in a real app
      const { data, error } = await supabase
        .from('questions')
        .select('tags');
      
      if (error) throw error;

      // Process tags to get counts
      const tagCounts: { [key: string]: number } = {};
      data?.forEach((question) => {
        question.tags?.forEach((tag: string) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });

      const processedTags = Object.entries(tagCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      setTags(processedTags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularTags = tags.slice(0, 10);
  const trendingTags = tags.slice(10, 20);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tags</h1>
          <p className="text-gray-600 mb-6">
            Browse questions by tags to find topics you're interested in.
          </p>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/80 border-blue-200 focus:border-blue-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Popular Tags */}
            <Card className="mb-8 bg-white/80 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Popular Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popularTags.map((tag) => (
                    <Link
                      key={tag.name}
                      to={`/search?q=${encodeURIComponent(tag.name)}`}
                      className="group"
                    >
                      <div className="p-4 border border-blue-100 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-blue-100 text-blue-800 group-hover:bg-blue-200">
                            {tag.name}
                          </Badge>
                          <span className="text-2xl font-bold text-blue-600">{tag.count}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {tag.count} question{tag.count !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* All Tags */}
            <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-blue-600" />
                  All Tags ({filteredTags.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredTags.map((tag) => (
                    <Link
                      key={tag.name}
                      to={`/search?q=${encodeURIComponent(tag.name)}`}
                      className="group"
                    >
                      <div className="flex items-center justify-between p-3 border border-blue-100 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 group-hover:bg-blue-200">
                          {tag.name}
                        </Badge>
                        <span className="text-sm font-medium text-gray-600">{tag.count}</span>
                      </div>
                    </Link>
                  ))}
                </div>

                {filteredTags.length === 0 && searchQuery && (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No tags found matching "{searchQuery}"</p>
                    <Button
                      onClick={() => setSearchQuery('')}
                      variant="outline"
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Tags;
