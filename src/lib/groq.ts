
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

export const analyzeContent = async (content: string, type: 'question' | 'answer') => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a content quality analyzer for a Q&A platform. Analyze the ${type} and return a JSON response with: quality_score (0-100), issues (array of strings), suggestions (array of strings), and spam_probability (0-1).`
        },
        {
          role: "user",
          content: content
        }
      ],
      model: "llama3-8b-8192",
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0]?.message?.content || '{}');
  } catch (error) {
    console.error('Groq API error:', error);
    return null;
  }
};

export const generateTags = async (title: string, description: string) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Generate relevant tags for a programming question. Return a JSON array of 3-5 tags."
        },
        {
          role: "user",
          content: `Title: ${title}\nDescription: ${description}`
        }
      ],
      model: "llama3-8b-8192",
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{"tags": []}');
    return result.tags || [];
  } catch (error) {
    console.error('Groq API error:', error);
    return [];
  }
};

export const improveQuestion = async (title: string, description: string) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Improve a programming question by making it clearer and more specific. Return JSON with improved_title and improved_description."
        },
        {
          role: "user",
          content: `Title: ${title}\nDescription: ${description}`
        }
      ],
      model: "llama3-8b-8192",
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0]?.message?.content || '{}');
  } catch (error) {
    console.error('Groq API error:', error);
    return null;
  }
};

export const generateAnswer = async (question: string, context: string = '') => {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful programming assistant. Provide a detailed, accurate answer to the programming question."
        },
        {
          role: "user",
          content: `Question: ${question}\nContext: ${context}`
        }
      ],
      model: "llama3-8b-8192"
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Groq API error:', error);
    return '';
  }
};

export { groq };
