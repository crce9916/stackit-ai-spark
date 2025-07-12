
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Eye, 
  Star, 
  Clock, 
  User,
  Award,
  CheckCircle,
  Edit,
  Flag,
  Share,
  Bookmark,
  Sparkles
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const QuestionDetail = () => {
  const { id } = useParams();
  const [newAnswer, setNewAnswer] = useState('');
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  // Mock data - in real app this would come from API
  const question = {
    id: parseInt(id || '1'),
    title: "How to implement JWT authentication in React?",
    description: `I'm building a React application and need to implement secure JWT authentication. I've been researching different approaches and I'm confused about the best practices.

**My main questions are:**

1. Should I store JWT tokens in localStorage or use httpOnly cookies?
2. How do I handle token refresh automatically?
3. What's the best way to protect routes that require authentication?

I've seen conflicting advice online about security implications of different storage methods. Some sources say localStorage is vulnerable to XSS attacks, while others mention CSRF concerns with cookies.

Here's what I've tried so far:

\`\`\`javascript
// Current login implementation
const login = async (credentials) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  
  const { token } = await response.json();
  localStorage.setItem('token', token);
};
\`\`\`

Any guidance on industry best practices would be greatly appreciated!`,
    tags: ["React", "JWT", "Authentication", "Security"],
    votes: 12,
    answers: 5,
    views: 234,
    author: "john_dev",
    authorReputation: 1250,
    timeAgo: "2 hours ago",
    isAnswered: true,
    acceptedAnswerId: 2,
    bounty: null
  };

  const answers = [
    {
      id: 1,
      content: `Great question! JWT authentication in React is indeed a complex topic. Let me break down the best practices:

## Storage Methods

**httpOnly Cookies (Recommended)**
- More secure against XSS attacks
- Automatically sent with requests
- Requires CSRF protection

**localStorage (Not recommended for production)**
- Vulnerable to XSS attacks
- Easy to implement
- Good for development/testing

## Implementation Example

Here's a secure implementation using httpOnly cookies:

\`\`\`javascript
// Login function
const login = async (credentials) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    credentials: 'include', // Important for cookies
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  
  if (response.ok) {
    // Token is automatically stored in httpOnly cookie
    window.location.href = '/dashboard';
  }
};

// API requests with automatic token inclusion
const apiCall = async (url, options = {}) => {
  return fetch(url, {
    ...options,
    credentials: 'include' // Includes cookies
  });
};
\`\`\`

## Route Protection

Use a higher-order component or custom hook:

\`\`\`javascript
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  
  useEffect(() => {
    checkAuthStatus().then(setIsAuthenticated);
  }, []);
  
  if (isAuthenticated === null) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return children;
};
\`\`\`

This approach provides better security while maintaining good user experience.`,
      author: "security_expert",
      authorReputation: 4560,
      timeAgo: "1 hour ago",
      votes: 8,
      isAccepted: false
    },
    {
      id: 2,
      content: `I'll add to the previous answer with some additional considerations:

## Token Refresh Strategy

For automatic token refresh, implement a response interceptor:

\`\`\`javascript
// Axios interceptor example
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await refreshToken();
        // Retry the original request
        return axios.request(error.config);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
\`\`\`

## Context API Integration

Create an auth context for global state management:

\`\`\`javascript
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const login = async (credentials) => {
    // Login logic here
  };
  
  const logout = () => {
    // Logout logic here
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
\`\`\`

This provides a clean, scalable solution for managing authentication state throughout your app.`,
      author: "react_master",
      authorReputation: 3890,
      timeAgo: "45 minutes ago",
      votes: 15,
      isAccepted: true
    }
  ];

  const relatedQuestions = [
    { id: 3, title: "React Router authentication guard implementation", votes: 7 },
    { id: 4, title: "JWT token expiration handling in React", votes: 11 },
    { id: 5, title: "Secure API calls with React and JWT", votes: 9 }
  ];

  const handleVote = (type: 'up' | 'down') => {
    setUserVote(userVote === type ? null : type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Question Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Link to="/questions" className="text-blue-600 hover:underline">
                  Questions
                </Link>
                <span className="text-gray-400">/</span>
                <span className="text-gray-600">#{question.id}</span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {question.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Asked {question.timeAgo}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{question.views} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{question.answers} answers</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {question.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Question Content */}
            <Card className="mb-8 bg-white/80 border-blue-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {question.author.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">{question.author}</p>
                      <p className="text-sm text-gray-500">{question.authorReputation} reputation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex gap-6">
                  {/* Voting */}
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote('up')}
                      className={userVote === 'up' ? 'text-green-600 bg-green-50' : ''}
                    >
                      <ThumbsUp className="h-5 w-5" />
                    </Button>
                    <span className="font-semibold text-lg">{question.votes}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote('down')}
                      className={userVote === 'down' ? 'text-red-600 bg-red-50' : ''}
                    >
                      <ThumbsDown className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="prose prose-blue max-w-none">
                      <div className="whitespace-pre-wrap">{question.description}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Assistance */}
            <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Sparkles className="h-5 w-5" />
                  AI-Powered Assistance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start text-purple-700 border-purple-200 hover:bg-purple-50">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Answer with AI
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-purple-700 border-purple-200 hover:bg-purple-50">
                    <Award className="h-4 w-4 mr-2" />
                    Suggest Improvements
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Answers Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {answers.length} Answers
              </h2>
              
              <div className="space-y-6">
                {answers.map((answer) => (
                  <Card key={answer.id} className={`bg-white/80 border-blue-200 ${answer.isAccepted ? 'ring-2 ring-green-200 bg-green-50/30' : ''}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {answer.author.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">{answer.author}</p>
                            <p className="text-sm text-gray-500">{answer.authorReputation} reputation</p>
                          </div>
                        </div>
                        
                        {answer.isAccepted && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="text-sm font-medium">Accepted Answer</span>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex gap-6">
                        {/* Voting */}
                        <div className="flex flex-col items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="h-5 w-5" />
                          </Button>
                          <span className="font-semibold text-lg">{answer.votes}</span>
                          <Button variant="ghost" size="sm">
                            <ThumbsDown className="h-5 w-5" />
                          </Button>
                          {!answer.isAccepted && (
                            <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">
                              <CheckCircle className="h-5 w-5" />
                            </Button>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="prose prose-blue max-w-none mb-4">
                            <div className="whitespace-pre-wrap">{answer.content}</div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-4">
                              <Button variant="ghost" size="sm">
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Comment
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share className="h-4 w-4 mr-1" />
                                Share
                              </Button>
                            </div>
                            <span>answered {answer.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Answer Form */}
            <Card className="bg-white/80 border-blue-200">
              <CardHeader>
                <CardTitle>Your Answer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Write your answer here... You can use Markdown formatting."
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                    className="min-h-[200px] bg-white/80 border-blue-200 focus:border-blue-400"
                  />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="text-purple-600 border-purple-200">
                        <Sparkles className="h-4 w-4 mr-1" />
                        AI Assist
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline">Preview</Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Post Answer
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Question Stats */}
            <Card className="bg-white/80 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Question Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Views</span>
                  <span className="font-semibold">{question.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Votes</span>
                  <span className="font-semibold">{question.votes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Answers</span>
                  <span className="font-semibold">{question.answers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bookmarked</span>
                  <span className="font-semibold">23</span>
                </div>
              </CardContent>
            </Card>

            {/* Related Questions */}
            <Card className="bg-white/80 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Related Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {relatedQuestions.map((q) => (
                    <div key={q.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                      <Link to={`/questions/${q.id}`} className="text-blue-600 hover:underline text-sm">
                        {q.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1">{q.votes} votes</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
                  <Sparkles className="h-5 w-5" />
                  🤖 You Might Also Like
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-white/60 rounded-lg">
                    <p className="font-medium text-purple-800">Advanced React Patterns</p>
                    <p className="text-purple-600 text-xs">Based on your interest in authentication</p>
                  </div>
                  <div className="p-3 bg-white/60 rounded-lg">
                    <p className="font-medium text-purple-800">Security Best Practices</p>
                    <p className="text-purple-600 text-xs">Popular among React developers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
