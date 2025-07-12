
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, MessageCircle, ThumbsUp, Trophy, Users, Zap, Brain, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Index = () => {
  const featuredQuestions = [
    {
      id: 1,
      title: "How to implement JWT authentication in React?",
      description: "I'm building a React app and need to implement secure JWT authentication...",
      tags: ["React", "JWT", "Authentication"],
      votes: 12,
      answers: 5,
      author: "john_dev",
      timeAgo: "2 hours ago"
    },
    {
      id: 2,
      title: "Best practices for database optimization in PostgreSQL",
      description: "Looking for advanced techniques to optimize query performance...",
      tags: ["PostgreSQL", "Database", "Performance"],
      votes: 8,
      answers: 3,
      author: "db_expert",
      timeAgo: "4 hours ago"
    },
    {
      id: 3,
      title: "Understanding React Hooks and Context API",
      description: "Can someone explain the difference between useState and useContext...",
      tags: ["React", "Hooks", "Context"],
      votes: 15,
      answers: 7,
      author: "react_learner",
      timeAgo: "1 day ago"
    }
  ];

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Assistance",
      description: "Get intelligent suggestions for tags, question improvements, and answer generation"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Driven",
      description: "Connect with developers worldwide and build knowledge together"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Smart Moderation",
      description: "AI-assisted content moderation ensures high-quality discussions"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Rich Text Editor",
      description: "Express yourself with a powerful editor supporting code, images, and formatting"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Zap className="h-4 w-4 mr-2" />
            AI-Powered Q&A Platform
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
            Stack<span className="text-blue-600">It</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in">
            The next-generation Q&A platform where developers collaborate, learn, and build amazing things together. 
            Get intelligent assistance and connect with a thriving community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/questions">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg">
                Explore Questions
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/ask">
              <Button size="lg" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105">
                Ask a Question
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose StackIt?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-blue-100 bg-white/70">
                <CardHeader>
                  <div className="mx-auto bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Questions */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Questions</h2>
            <Link to="/questions">
              <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                View All Questions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-6">
            {featuredQuestions.map((question) => (
              <Card key={question.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-blue-100 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link to={`/questions/${question.id}`}>
                        <CardTitle className="text-xl hover:text-blue-600 transition-colors cursor-pointer mb-2">
                          {question.title}
                        </CardTitle>
                      </Link>
                      <CardDescription className="text-gray-600 mb-4">
                        {question.description}
                      </CardDescription>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {question.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{question.votes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{question.answers} answers</span>
                        </div>
                        <span>by {question.author}</span>
                        <span>{question.timeAgo}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <Trophy className="h-16 w-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">Ready to Join the Community?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Start asking questions, sharing knowledge, and building amazing things with fellow developers.
          </p>
          <Link to="/ask">
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105">
              Ask Your First Question
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
