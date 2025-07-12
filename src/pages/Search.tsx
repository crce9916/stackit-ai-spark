
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search as SearchIcon, Filter, Sparkles, MessageSquare, ThumbsUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { groq } from '@/lib/groq';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<any[]>([]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    if (query) {
      performSearch();
      generateAISuggestions();
    }
  }, [query, sortBy, filterBy]);

  const performSearch = async () => {
    setLoading(true);
    try {
      let queryBuilder = supabase
        .from('questions')
        .select(`
          *,
          profiles:author_id(username),
          answers(count)
        `);

      // Apply search filter
      if (query) {
        queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`);
      }

      // Apply content filter
      if (filterBy !== 'all') {
        if (filterBy === 'unanswered') {
          queryBuilder = queryBuilder.eq('answer_count', 0);
        } else if (filterBy === 'accepted') {
          queryBuilder = queryBuilder.eq('has_accepted_answer', true);
        }
      }

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          queryBuilder = queryBuilder.order('created_at', { ascending: false });
          break;
        case 'votes':
          queryBuilder = queryBuilder.order('votes', { ascending: false });
          break;
        case 'answers':
          queryBuilder = queryBuilder.order('answer_count', { ascending: false });
          break;
        default:
          queryBuilder = queryBuilder.order('created_at', { ascending: false });
      }

      const { data, error } = await queryBuilder.limit(20);
      
      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAISuggestions = async () => {
    if (!query) return;
    
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Generate 3-5 related search suggestions for a programming Q&A platform. Return only a JSON array of strings."
          },
          {
            role: "user",
            content: `Search query: ${query}`
          }
        ],
        model: "llama3-8b-8192",
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(completion.choices[0]?.message?.content || '{"suggestions": []}');
      setAiSuggestions(result.suggestions || []);
    } catch (error) {
      console.error('AI suggestions error:', error);
    }
  };

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setSearchParams({ q: newQuery });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Questions</h1>
          
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search questions, tags, or topics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
                className="pl-10 bg-white/80 border-blue-200 focus:border-blue-400"
              />
            </div>
            <Button 
              onClick={() => handleSearch(query)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Search
            </Button>
          </div>

          {/* AI Suggestions */}
          {aiSuggestions.length > 0 && (
            <Card className="mb-6 bg-white/80 backdrop-blur-sm border-blue-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">AI-Powered Suggestions</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearch(suggestion)}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <div className="flex gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-white/80 border-blue-200">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Most Relevant</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="votes">Most Voted</SelectItem>
                <SelectItem value="answers">Most Answered</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-48 bg-white/80 border-blue-200">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Questions</SelectItem>
                <SelectItem value="unanswered">Unanswered</SelectItem>
                <SelectItem value="accepted">Has Accepted Answer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {results.length} result{results.length !== 1 ? 's' : ''} found
                  {query && <span className="text-blue-600"> for "{query}"</span>}
                </h2>
              </div>

              {results.map((question) => (
                <Card key={question.id} className="bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <CardTitle className="text-xl hover:text-blue-600 transition-colors cursor-pointer">
                        {question.title}
                      </CardTitle>
                      {question.has_accepted_answer && (
                        <Badge className="bg-green-100 text-green-800">Solved</Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{question.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {question.tags?.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{question.votes || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{question.answer_count || 0} answers</span>
                        </div>
                        <span>by {question.profiles?.username || 'Anonymous'}</span>
                        <span>{new Date(question.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {results.length === 0 && query && !loading && (
                <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
                  <CardContent className="p-12 text-center">
                    <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search terms or explore different keywords.
                    </p>
                    <Button onClick={() => handleSearch('')} variant="outline">
                      Browse All Questions
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
