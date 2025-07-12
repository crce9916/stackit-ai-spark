
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle, BookOpen, Users, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Guidelines = () => {
  const guidelines = [
    {
      category: "Asking Questions",
      icon: <BookOpen className="h-5 w-5" />,
      rules: [
        {
          type: "do",
          text: "Search for existing answers before asking",
          description: "Check if your question has already been answered to avoid duplicates."
        },
        {
          type: "do",
          text: "Write clear, specific titles",
          description: "Your title should summarize the problem in one concise sentence."
        },
        {
          type: "do",
          text: "Provide detailed context and code",
          description: "Include relevant code, error messages, and what you've tried."
        },
        {
          type: "dont",
          text: "Ask multiple questions in one post",
          description: "Keep each question focused on a single problem."
        },
        {
          type: "dont",
          text: "Use vague titles like 'Help me' or 'It doesn't work'",
          description: "Be specific about what you're trying to achieve."
        }
      ]
    },
    {
      category: "Providing Answers",
      icon: <Users className="h-5 w-5" />,
      rules: [
        {
          type: "do",
          text: "Answer the specific question asked",
          description: "Address the user's actual problem, not what you think they should be doing."
        },
        {
          type: "do",
          text: "Explain your reasoning",
          description: "Don't just provide code - explain why it works and how."
        },
        {
          type: "do",
          text: "Test your solutions",
          description: "Make sure your answer actually works before posting."
        },
        {
          type: "dont",
          text: "Copy answers from other sources without attribution",
          description: "Always credit external sources and explain the solution."
        },
        {
          type: "dont",
          text: "Post 'me too' or 'I have the same problem' answers",
          description: "Upvote the question instead or ask your own question."
        }
      ]
    },
    {
      category: "Community Behavior",
      icon: <Shield className="h-5 w-5" />,
      rules: [
        {
          type: "do",
          text: "Be respectful and constructive",
          description: "Treat all community members with kindness and respect."
        },
        {
          type: "do",
          text: "Stay on topic",
          description: "Keep discussions relevant to the question or programming topic."
        },
        {
          type: "do",
          text: "Help others learn",
          description: "Focus on education rather than just providing solutions."
        },
        {
          type: "dont",
          text: "Use discriminatory or offensive language",
          description: "Maintain a professional and inclusive environment."
        },
        {
          type: "dont",
          text: "Spam or self-promote excessively",
          description: "Focus on helping others rather than promoting yourself."
        }
      ]
    }
  ];

  const getRuleIcon = (type: string) => {
    switch (type) {
      case 'do':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'dont':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getRuleBadge = (type: string) => {
    switch (type) {
      case 'do':
        return <Badge className="bg-green-100 text-green-800">Do</Badge>;
      case 'dont':
        return <Badge className="bg-red-100 text-red-800">Don't</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Note</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Guidelines</h1>
          <p className="text-lg text-gray-600">
            Help us maintain a welcoming, helpful, and high-quality community by following these guidelines.
          </p>
        </div>

        {/* Overview Card */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-blue-100">
          <CardContent className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                StackIt is a community where developers help each other learn, grow, and solve problems together. 
                These guidelines ensure everyone has a positive experience.
              </p>
              <div className="flex justify-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Be Helpful</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>Be Respectful</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                  <span>Be Clear</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guidelines Sections */}
        <div className="space-y-8">
          {guidelines.map((section, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    {section.icon}
                  </div>
                  {section.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.rules.map((rule, ruleIndex) => (
                    <div key={ruleIndex} className="flex gap-4 p-4 rounded-lg border border-gray-100">
                      <div className="flex-shrink-0 mt-1">
                        {getRuleIcon(rule.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          {getRuleBadge(rule.type)}
                          <h3 className="font-medium text-gray-900">{rule.text}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{rule.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enforcement Section */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg text-red-600">
                <Shield className="h-5 w-5" />
              </div>
              Enforcement & Consequences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Violations of these guidelines may result in the following actions:
              </p>
              <div className="grid gap-4">
                <div className="flex gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800">Warning</h4>
                    <p className="text-sm text-yellow-700">First-time minor violations receive a friendly reminder.</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <XCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-800">Content Removal</h4>
                    <p className="text-sm text-orange-700">Inappropriate content will be removed or edited.</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <Shield className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">Account Suspension</h4>
                    <p className="text-sm text-red-700">Serious or repeated violations may result in temporary or permanent suspension.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="mt-8 bg-white/80 backdrop-blur-sm border-blue-100">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Questions About These Guidelines?</h2>
            <p className="text-gray-600 mb-4">
              If you have questions about these guidelines or need to report a violation, please contact our moderation team.
            </p>
            <Badge className="bg-blue-100 text-blue-800">
              Email: moderation@stackit.dev
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Guidelines;
