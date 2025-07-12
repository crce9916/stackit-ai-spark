
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Eye, 
  Save, 
  Send, 
  Hash, 
  Lightbulb, 
  BookOpen, 
  Code,
  Image,
  Link,
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Smile
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const AskQuestion = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [activeEditor, setActiveEditor] = useState<'write' | 'preview'>('write');

  const suggestedTags = ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'CSS', 'HTML', 'API', 'Database', 'Authentication'];
  
  const formatButtons = [
    { icon: Bold, label: 'Bold', shortcut: 'Ctrl+B' },
    { icon: Italic, label: 'Italic', shortcut: 'Ctrl+I' },
    { icon: List, label: 'Bullet List' },
    { icon: ListOrdered, label: 'Numbered List' },
    { icon: Code, label: 'Code Block' },
    { icon: Link, label: 'Insert Link' },
    { icon: Image, label: 'Upload Image' },
    { icon: Smile, label: 'Emoji' },
  ];

  const alignButtons = [
    { icon: AlignLeft, label: 'Align Left' },
    { icon: AlignCenter, label: 'Align Center' },
    { icon: AlignRight, label: 'Align Right' },
  ];

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag(tagInput.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Form */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Ask a Question</h1>
              <p className="text-gray-600">Get help from the community by asking clear, detailed questions.</p>
            </div>

            <div className="space-y-8">
              {/* Title Section */}
              <Card className="bg-white/80 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-blue-600" />
                    Question Title
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Be specific and imagine you're asking a question to another person</Label>
                    <Input
                      id="title"
                      placeholder="e.g., How to implement JWT authentication in React?"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-2 bg-white/80 border-blue-200 focus:border-blue-400"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-purple-600 border-purple-200 hover:bg-purple-50">
                      <Sparkles className="h-4 w-4 mr-1" />
                      ✍️ Improve My Question
                    </Button>
                    <span className="text-xs text-gray-500">AI-powered suggestions</span>
                  </div>
                </CardContent>
              </Card>

              {/* Description Section */}
              <Card className="bg-white/80 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Question Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Rich Text Toolbar */}
                  <div className="border border-blue-200 rounded-lg bg-white/60">
                    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-blue-200">
                      {formatButtons.map((button, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 hover:bg-blue-50"
                          title={button.label}
                        >
                          <button.icon className="h-4 w-4" />
                        </Button>
                      ))}
                      
                      <div className="w-px h-6 bg-gray-300 mx-1" />
                      
                      {alignButtons.map((button, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 hover:bg-blue-50"
                          title={button.label}
                        >
                          <button.icon className="h-4 w-4" />
                        </Button>
                      ))}
                    </div>
                    
                    <Tabs value={activeEditor} onValueChange={(value) => setActiveEditor(value as 'write' | 'preview')}>
                      <TabsList className="ml-2 mt-2">
                        <TabsTrigger value="write">Write</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="write" className="p-0 m-0">
                        <Textarea
                          placeholder="Describe your problem in detail. Include code snippets, error messages, and what you've tried so far..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="min-h-[300px] border-0 rounded-none rounded-b-lg bg-white/80 focus:ring-0 focus:border-0 resize-none"
                        />
                      </TabsContent>
                      
                      <TabsContent value="preview" className="p-4 min-h-[300px] bg-white/80">
                        <div className="prose prose-blue max-w-none">
                          {description ? (
                            <div className="whitespace-pre-wrap">{description}</div>
                          ) : (
                            <p className="text-gray-500 italic">Nothing to preview yet...</p>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-purple-600 border-purple-200 hover:bg-purple-50">
                      <Sparkles className="h-4 w-4 mr-1" />
                      ✍️ Generate Answer with AI
                    </Button>
                    <span className="text-xs text-gray-500">Get AI assistance with your description</span>
                  </div>
                </CardContent>
              </Card>

              {/* Tags Section */}
              <Card className="bg-white/80 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-blue-600" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="tags">Add up to 5 tags to describe what your question is about</Label>
                    <div className="mt-2 space-y-3">
                      <Input
                        id="tags"
                        placeholder="Type a tag and press Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyPress}
                        className="bg-white/80 border-blue-200 focus:border-blue-400"
                        disabled={tags.length >= 5}
                      />
                      
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                              onClick={() => handleRemoveTag(tag)}
                            >
                              {tag} ×
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-600">Suggested tags:</span>
                      <Button variant="outline" size="sm" className="text-purple-600 border-purple-200 hover:bg-purple-50">
                        <Sparkles className="h-4 w-4 mr-1" />
                        🔍 Suggest Tags with AI
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-50 border-blue-200 text-blue-700"
                          onClick={() => handleAddTag(tag)}
                        >
                          + {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button variant="ghost" className="text-gray-600">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
                
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  <Send className="h-4 w-4 mr-2" />
                  Post Question
                </Button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Writing Tips */}
            <Card className="bg-white/80 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Writing Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">Be Specific</h4>
                    <p className="text-gray-600">Include error messages, code snippets, and expected vs actual behavior.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Show Your Work</h4>
                    <p className="text-gray-600">Explain what you've tried and why it didn't work.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Use Proper Tags</h4>
                    <p className="text-gray-600">Choose tags that accurately describe your technology stack.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Format Code</h4>
                    <p className="text-gray-600">Use code blocks for better readability.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Features */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-purple-700">
                  <Sparkles className="h-5 w-5" />
                  AI-Powered Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-white/60 rounded-lg">
                  <h4 className="font-semibold text-purple-800">🔍 Smart Tag Suggestions</h4>
                  <p className="text-purple-600">Get relevant tags based on your question content</p>
                </div>
                <div className="p-3 bg-white/60 rounded-lg">
                  <h4 className="font-semibold text-purple-800">✍️ Question Enhancement</h4>
                  <p className="text-purple-600">Improve clarity and structure automatically</p>
                </div>
                <div className="p-3 bg-white/60 rounded-lg">
                  <h4 className="font-semibold text-purple-800">🤖 Answer Generation</h4>
                  <p className="text-purple-600">Get AI-generated answers to kickstart discussions</p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/80 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Your Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Questions Asked</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Answers Given</span>
                  <span className="font-semibold">7</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Reputation</span>
                  <span className="font-semibold text-green-600">+125</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">This Week</span>
                  <span className="font-semibold text-blue-600">2 questions</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;
