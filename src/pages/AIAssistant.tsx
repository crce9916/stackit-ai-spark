
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Sparkles, 
  MessageSquare, 
  Code, 
  Search,
  Lightbulb,
  Zap,
  BookOpen,
  Target
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { analyzeContent, generateTags, improveQuestion, generateAnswer } from '@/lib/groq';
import { toast } from '@/components/ui/use-toast';

const AIAssistant = () => {
  const [activeTab, setActiveTab] = useState('analyze');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Form states
  const [analyzeText, setAnalyzeText] = useState('');
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDesc, setQuestionDesc] = useState('');
  const [answerContext, setAnswerContext] = useState('');

  const handleAnalyze = async () => {
    if (!analyzeText.trim()) {
      toast({ title: "Error", description: "Please enter text to analyze" });
      return;
    }

    setLoading(true);
    try {
      const analysis = await analyzeContent(analyzeText, 'question');
      setResults(analysis);
      toast({ title: "Success", description: "Content analyzed successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to analyze content" });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTags = async () => {
    if (!questionTitle.trim() || !questionDesc.trim()) {
      toast({ title: "Error", description: "Please enter both title and description" });
      return;
    }

    setLoading(true);
    try {
      const tags = await generateTags(questionTitle, questionDesc);
      setResults({ tags });
      toast({ title: "Success", description: "Tags generated successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate tags" });
    } finally {
      setLoading(false);
    }
  };

  const handleImproveQuestion = async () => {
    if (!questionTitle.trim() || !questionDesc.trim()) {
      toast({ title: "Error", description: "Please enter both title and description" });
      return;
    }

    setLoading(true);
    try {
      const improved = await improveQuestion(questionTitle, questionDesc);
      setResults(improved);
      toast({ title: "Success", description: "Question improved successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to improve question" });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnswer = async () => {
    if (!questionTitle.trim()) {
      toast({ title: "Error", description: "Please enter a question" });
      return;
    }

    setLoading(true);
    try {
      const answer = await generateAnswer(questionTitle, answerContext);
      setResults({ answer });
      toast({ title: "Success", description: "Answer generated successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate answer" });
    } finally {
      setLoading(false);
    }
  };

  const aiFeatures = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "Content Quality Analysis",
      description: "Analyze your questions and answers for quality, clarity, and completeness"
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Smart Tag Generation",
      description: "Automatically generate relevant tags based on your question content"
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Question Improvement",
      description: "Get suggestions to make your questions clearer and more engaging"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Answer Generation",
      description: "Generate comprehensive answers to help you understand complex topics"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Brain className="h-4 w-4 mr-2" />
            AI-Powered Assistant
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">StackIt AI Assistant</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enhance your Q&A experience with intelligent content analysis, tag suggestions, 
            question improvements, and answer generation powered by advanced AI.
          </p>
        </div>

        {/* Feature Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {aiFeatures.map((feature, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-blue-100 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Tools */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="analyze">Analyze Content</TabsTrigger>
                <TabsTrigger value="tags">Generate Tags</TabsTrigger>
                <TabsTrigger value="improve">Improve Question</TabsTrigger>
                <TabsTrigger value="answer">Generate Answer</TabsTrigger>
              </TabsList>

              <TabsContent value="analyze" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="analyze-text">Content to Analyze</Label>
                  <Textarea
                    id="analyze-text"
                    placeholder="Paste your question or answer here for quality analysis..."
                    value={analyzeText}
                    onChange={(e) => setAnalyzeText(e.target.value)}
                    className="min-h-[150px] mt-2"
                  />
                </div>
                <Button onClick={handleAnalyze} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4 mr-2" />
                      Analyze Content
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="tags" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="tag-title">Question Title</Label>
                  <Input
                    id="tag-title"
                    placeholder="Enter your question title..."
                    value={questionTitle}
                    onChange={(e) => setQuestionTitle(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="tag-desc">Question Description</Label>
                  <Textarea
                    id="tag-desc"
                    placeholder="Enter your question description..."
                    value={questionDesc}
                    onChange={(e) => setQuestionDesc(e.target.value)}
                    className="min-h-[100px] mt-2"
                  />
                </div>
                <Button onClick={handleGenerateTags} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Generate Tags
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="improve" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="improve-title">Question Title</Label>
                  <Input
                    id="improve-title"
                    placeholder="Enter your question title..."
                    value={questionTitle}
                    onChange={(e) => setQuestionTitle(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="improve-desc">Question Description</Label>
                  <Textarea
                    id="improve-desc"
                    placeholder="Enter your question description..."
                    value={questionDesc}
                    onChange={(e) => setQuestionDesc(e.target.value)}
                    className="min-h-[100px] mt-2"
                  />
                </div>
                <Button onClick={handleImproveQuestion} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Improving...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Improve Question
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="answer" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="answer-question">Question</Label>
                  <Input
                    id="answer-question"
                    placeholder="Enter the question you want answered..."
                    value={questionTitle}
                    onChange={(e) => setQuestionTitle(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="answer-context">Additional Context (Optional)</Label>
                  <Textarea
                    id="answer-context"
                    placeholder="Provide any additional context or specific requirements..."
                    value={answerContext}
                    onChange={(e) => setAnswerContext(e.target.value)}
                    className="min-h-[100px] mt-2"
                  />
                </div>
                <Button onClick={handleGenerateAnswer} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Generate Answer
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>

            {/* Results Display */}
            {results && (
              <Card className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <Zap className="h-5 w-5" />
                    AI Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activeTab === 'analyze' && results.quality_score && (
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-2xl font-bold text-purple-600">
                          {Math.round(results.quality_score * 100)}%
                        </div>
                        <div>
                          <div className="font-semibold">Quality Score</div>
                          <div className="text-sm text-gray-600">Content quality assessment</div>
                        </div>
                      </div>
                      
                      {results.issues && results.issues.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">Issues Found:</h4>
                          <div className="space-y-1">
                            {results.issues.map((issue: string, index: number) => (
                              <Badge key={index} variant="destructive" className="mr-2">
                                {issue}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {results.suggestions && results.suggestions.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Suggestions:</h4>
                          <div className="space-y-1">
                            {results.suggestions.map((suggestion: string, index: number) => (
                              <Badge key={index} variant="secondary" className="mr-2">
                                {suggestion}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'tags' && results.tags && (
                    <div>
                      <h4 className="font-semibold mb-3">Suggested Tags:</h4>
                      <div className="flex flex-wrap gap-2">
                        {results.tags.map((tag: string, index: number) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'improve' && (results.improved_title || results.improved_description) && (
                    <div className="space-y-4">
                      {results.improved_title && (
                        <div>
                          <h4 className="font-semibold mb-2">Improved Title:</h4>
                          <div className="p-3 bg-white rounded-lg border">
                            {results.improved_title}
                          </div>
                        </div>
                      )}
                      {results.improved_description && (
                        <div>
                          <h4 className="font-semibold mb-2">Improved Description:</h4>
                          <div className="p-3 bg-white rounded-lg border">
                            {results.improved_description}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'answer' && results.answer && (
                    <div>
                      <h4 className="font-semibold mb-2">Generated Answer:</h4>
                      <div className="p-4 bg-white rounded-lg border">
                        <div className="prose prose-sm max-w-none">
                          {results.answer.split('\n').map((paragraph: string, index: number) => (
                            <p key={index} className="mb-2">{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIAssistant;
