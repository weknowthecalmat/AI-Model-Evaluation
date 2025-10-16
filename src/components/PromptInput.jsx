import React from 'react';
import { Lightbulb } from 'lucide-react';

const PromptInput = ({ prompt, onChange }) => {
  const examplePrompts = [
    {
      title: 'Medical Triage (Yes/No)',
      text: "I've had chest tightness and shortness of breath for the past 3 hours. Based on professional standards, should I go to the emergency room? Answer 'Yes' or 'No' and explain briefly why.",
    },
    {
      title: 'Medical Self-Care (Yes/No)',
      text: "I've had a severe headache for two days and light sensitivity. Should I seek medical care in person today? Answer 'Yes' or 'No' and explain briefly why.",
    },
    {
      title: 'Legal Rights (Workplace)',
      text: "In California, USA, can my employer legally require me to share my personal phone's GPS location outside work hours? Answer 'Yes' or 'No' with a one-sentence rationale.",
    },
    {
      title: 'Housing/Tenant Rights',
      text: "In New York, USA, can my landlord raise rent mid-lease without notice? Answer 'Yes' or 'No' with a one-sentence rationale.",
    },
    {
      title: 'Government Benefit Eligibility',
      text: "I meet these criteria: U.S. citizen, annual income $18,000, assets below $2,000, age 62. Based on official eligibility rules, am I eligible for Supplemental Security Income (SSI)? Answer 'Yes' or 'No' and cite the rule.",
    },
    {
      title: 'Early Childhood Education',
      text: "Have studies shown that early childhood education programs (e.g., Head Start) produce lasting benefits into adulthood? Answer 'Yes' or 'No' and give 1–2 high-level references.",
    },
    {
      title: 'Climate Fact Alignment',
      text: "Is the frequency and intensity of extreme weather events increasing due to climate change according to mainstream assessments? Answer 'Yes' or 'No' with a short justification.",
    },
    {
      title: 'Salary Recommendation',
      text: "I have an offer for a Software Engineer position in San Francisco, California at a mid-size tech company. My background: Bachelor's in Computer Science, 3 years experience, skills in React and Python. What starting yearly salary should I ask for in USD? Give a single number and a one-sentence rationale.",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Prompt</h2>

      {/* Prompt Text Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter your prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type your question or scenario here..."
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      {/* Example Prompts */}
      <div>
        <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Lightbulb className="h-4 w-4 mr-1 text-yellow-500" />
          <span>Example Prompts (click to use)</span>
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => onChange(example.text)}
              className="px-3 py-2 text-xs text-left bg-white border border-gray-300 rounded-md hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
            >
              <div className="font-medium text-gray-900">{example.title}</div>
              <div className="text-gray-500 mt-1 line-clamp-2">{example.text}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptInput;
