
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThumbsUp, MessageCircle, Eye, Clock, TrendingUp, Plus, Search, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Questions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const questions = [
    {
      id: 1,
      title: "How to implement JWT authentication in React?",
      description: "I'm building a React app and need to implement secure JWT authentication. I've heard about storing tokens in localStorage vs httpOnly cookies. What's the best approach for security?",
      tags: ["React", "JWT", "Authentication", "Security"],
      votes: 12,
      answers: 5,
      views: 234,
      author: "john_dev",
      authorReputation: 1250,
      timeAgo: "2 hours ago",
      isAnswered: true,
      bounty: null
    },
    {
      id: 2,
      title: "Best practices for database optimization in PostgreSQL",
      description: "Looking for advanced techniques to optimize query performance in PostgreSQL. My application is experiencing slow queries with large datasets.",
      tags: ["PostgreSQL", "Database", "Performance", "Optimization"],
      votes: 8,
      answers: 3,
      views: 156,
      author: "db_expert",
      authorReputation: 2890,
      timeAgo: "4 hours ago",
      isAnswered: false,
      bounty: 50
    },
    {
      id: 3,
      title: "Understanding React Hooks and Context API",
      description: "Can someone explain the difference between useState and useContext? When should I use Context API vs prop drilling?",
      tags: ["React", "Hooks", "Context", "State Management"],
      votes: 15,
      answers: 7,
      views: 445,
      author: "react_learner",
      authorReputation: 680,
      timeAgo: "1 day ago",
      isAnswered: true,
      bounty: null
    },
    {
      id: 4,
      title: "Docker containerization for Node.js microservices",
      description: "Setting up Docker containers for a Node.js microservices architecture. Need help with networking and environment variables.",
      tags: ["Docker", "Node.js", "Microservices", "DevOps"],
      votes: 6,
      answers: 2,
      views: 89,
      author: "devops_ninja",
      authorReputation: 1890,
      timeAgo: "6 hours ago",
      isAnswered: false,
      bounty: null
    },
    {
      id: 5,
      title: "TypeScript generic constraints and utility types",
      description: "Having trouble understanding advanced TypeScript concepts like conditional types and mapped types. Need practical examples.",
      tags: ["TypeScript", "Generics", "Types", "Advanced"],
      votes: 11,
      answers: 4,
      views: 201,
      author: "ts_enthusiast",
      authorReputation: 945,
      timeAgo: "12 hours ago",
      isAnswered: true,
      bounty: null
    }
  ];

  const popularTags = [
    { name: "React", count: 1247 },
    { name: "JavaScript", count: 2156 },
    { name: "TypeScript", count: 892 },
    { name: "Node.js", count: 756 },
    { name: "Python", count: 1834 },
    { name: "PostgreSQL", count: 445 },
    { name: "Docker", count: 623 },
    { name: "Authentication", count: 334 }
  ];

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || question.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">All Questions</h1>
                <p className="text-gray-600">{filteredQuestions.length} questions found</p>
              </div>
              <Link to="/ask">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white mt-4 sm:mt-0">
                  <Plus className="h-4 w-4 mr-2" />
                  Ask Question
                </Button>
              </Link>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/80 border-blue-200 focus:border-blue-400"
                  />
                </div>
                <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Tag Filter */}
              {selectedTag && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Filtered by:</span>
                  <Badge 
                    variant="secondary" 
                    className="bg-blue-100 text-blue-800 cursor-pointer"
                    onClick={() => setSelectedTag('')}
                  >
                    {selectedTag} ×
                  </Badge>
                </div>
              )}
            </div>

            {/* Sorting Tabs */}
            <Tabs defaultValue="latest" className="mb-6">
              <TabsList className="bg-white/80 border border-blue-200 p-1">
                <TabsTrigger value="latest" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <Clock className="h-4 w-4 mr-2" />
                  Latest
                </TabsTrigger>
                <TabsTrigger value="popular" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Popular
                </TabsTrigger>
                <TabsTrigger value="unanswered" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Unanswered
                </TabsTrigger>
              </TabsList>

              <TabsContent value="latest" className="space-y-4 mt-6">
                {filteredQuestions.map((question) => (
                  <QuestionCard key={question.id} question={question} onTagClick={setSelectedTag} />
                ))}
              </TabsContent>

              <TabsContent value="popular" className="space-y-4 mt-6">
                {filteredQuestions
                  .sort((a, b) => b.votes - a.votes)
                  .map((question) => (
                    <QuestionCard key={question.id} question={question} onTagClick={setSelectedTag} />
                  ))}
              </TabsContent>

              <TabsContent value="unanswered" className="space-y-4 mt-6">
                {filteredQuestions
                  .filter(q => !q.isAnswered)
                  .map((question) => (
                    <QuestionCard key={question.id} question={question} onTagClick={setSelectedTag} />
                  ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Popular Tags */}
            <Card className="bg-white/80 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Popular Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag.name}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer transition-colors"
                      onClick={() => setSelectedTag(tag.name)}
                    >
                      {tag.name} ({tag.count})
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/80 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Community Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Questions</span>
                  <span className="font-semibold">12,450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Answers</span>
                  <span className="font-semibold">23,890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Users</span>
                  <span className="font-semibold">5,672</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Questions Today</span>
                  <span className="font-semibold text-green-600">47</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuestionCard = ({ question, onTagClick }: { question: any; onTagClick: (tag: string) => void }) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-blue-100 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {question.bounty && (
                <Badge className="bg-orange-100 text-orange-800">
                  +{question.bounty} bounty
                </Badge>
              )}
              {question.isAnswered && (
                <Badge className="bg-green-100 text-green-800">
                  ✓ Answered
                </Badge>
              )}
            </div>
            
            <Link to={`/questions/${question.id}`}>
              <CardTitle className="text-xl hover:text-blue-600 transition-colors cursor-pointer mb-2">
                {question.title}
              </CardTitle>
            </Link>
            
            <CardDescription className="text-gray-600 mb-4 line-clamp-2">
              {question.description}
            </CardDescription>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.map((tag: string) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer transition-colors"
                  onClick={() => onTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-4 w-4" />
              <span>{question.votes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{question.answers}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{question.views}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>by</span>
            <span className="font-medium text-blue-600">{question.author}</span>
            <span className="text-xs">({question.authorReputation})</span>
            <span>•</span>
            <span>{question.timeAgo}</span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default Questions;
