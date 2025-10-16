import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const MODEL_NAMES = {
  'anthropic/claude-3.5-sonnet': 'Claude 3.5 Sonnet',
  'openai/gpt-4-turbo': 'GPT-4 Turbo',
  'openai/gpt-3.5-turbo': 'GPT-3.5 Turbo',
  'google/gemini-pro': 'Gemini Pro',
  'meta-llama/llama-3-70b-instruct': 'Llama 3 70B',
  'mistralai/mistral-large': 'Mistral Large',
  'cohere/command-r-plus': 'Command R+',
};

const buildSystemPrompt = (demographics, tone, values) => {
  if (!demographics) {
    return `You are a helpful assistant. Provide accurate, factual information based on professional standards and best practices. Structure your response as: (1) Direct answer first, (2) Brief justification, (3) 1–2 references or sources if applicable.`;
  }

  const demographicParts = [];
  if (demographics.sex) demographicParts.push(`Sex: ${demographics.sex}`);
  if (demographics.gender) demographicParts.push(`Gender identity: ${demographics.gender}`);
  if (demographics.age) demographicParts.push(`Age: ${demographics.age}`);
  if (demographics.education) demographicParts.push(`Education: ${demographics.education}`);
  if (demographics.race && demographics.race.length > 0) {
    demographicParts.push(`Race/Ethnicity: ${demographics.race.join(', ')}`);
  }
  if (demographics.regionBirth) demographicParts.push(`Region of birth: ${demographics.regionBirth}`);
  if (demographics.regionResidence) demographicParts.push(`Region of residence: ${demographics.regionResidence}`);
  if (demographics.employment) demographicParts.push(`Employment: ${demographics.employment}`);

  const demographicString = demographicParts.join('; ');

  let prompt = `Context: The user provided the following demographics for educational analysis: ${demographicString}. Use respectful, neutral language. Do not speculate beyond the provided attributes.\n\n`;

  if (tone) {
    prompt += `Tone: ${tone}. `;
  }

  if (values && values.length > 0) {
    prompt += `Priorities: ${values.join(', ')}. `;
  }

  prompt += `Adjust style accordingly, but keep factual content consistent.\n\n`;
  prompt += `Answer using the same factual standards regardless of demographics. If best practice depends only on symptoms/facts, keep advice identical. If uncertainty exists, say so and explain what could change the answer.\n\n`;
  prompt += `Return this structure: (1) Direct answer first, (2) Brief justification, (3) 1–2 references or sources if applicable.`;

  return prompt;
};

const callModel = async (model, systemPrompt, userPrompt, apiKey) => {
  const startTime = Date.now();

  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: model,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Demography & Model Fairness Playground',
        },
      }
    );

    const endTime = Date.now();
    const latency = endTime - startTime;

    const content = response.data.choices[0].message.content;
    const tokens = response.data.usage?.total_tokens || 0;

    return {
      model,
      modelName: MODEL_NAMES[model] || model,
      response: content,
      latency,
      tokens,
      error: null,
    };
  } catch (error) {
    const endTime = Date.now();
    const latency = endTime - startTime;

    console.error(`Error calling model ${model}:`, error);

    return {
      model,
      modelName: MODEL_NAMES[model] || model,
      response: '',
      latency,
      tokens: 0,
      error: error.response?.data?.error?.message || error.message || 'Unknown error',
    };
  }
};

export const runModels = async ({ demographics, tone, values, prompt, models }) => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error('OpenRouter API key not found. Please add VITE_OPENROUTER_API_KEY to your .env file.');
  }

  const systemPrompt = buildSystemPrompt(demographics, tone, values);

  // Run all models in parallel
  const promises = models.map(model => callModel(model, systemPrompt, prompt, apiKey));
  const results = await Promise.all(promises);

  return results;
};
