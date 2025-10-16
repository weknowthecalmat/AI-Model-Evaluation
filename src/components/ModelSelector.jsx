import React from 'react';
import { CheckSquare, Square } from 'lucide-react';

const ModelSelector = ({ selectedModels, onChange }) => {
  const availableModels = [
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
    { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
    { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
    { id: 'google/gemini-pro', name: 'Gemini Pro', provider: 'Google' },
    { id: 'meta-llama/llama-3-70b-instruct', name: 'Llama 3 70B', provider: 'Meta' },
    { id: 'mistralai/mistral-large', name: 'Mistral Large', provider: 'Mistral AI' },
    { id: 'cohere/command-r-plus', name: 'Command R+', provider: 'Cohere' },
  ];

  const handleToggle = (modelId) => {
    const newSelection = selectedModels.includes(modelId)
      ? selectedModels.filter(id => id !== modelId)
      : [...selectedModels, modelId];
    onChange(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedModels.length === availableModels.length) {
      onChange([]);
    } else {
      onChange(availableModels.map(m => m.id));
    }
  };

  const allSelected = selectedModels.length === availableModels.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Models</h2>
        <button
          onClick={handleSelectAll}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
        >
          {allSelected ? (
            <>
              <CheckSquare className="h-4 w-4 mr-1" />
              Deselect All
            </>
          ) : (
            <>
              <Square className="h-4 w-4 mr-1" />
              Select All
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {availableModels.map((model) => {
          const isSelected = selectedModels.includes(model.id);
          return (
            <button
              key={model.id}
              onClick={() => handleToggle(model.id)}
              className={`flex items-center px-4 py-3 rounded-md border transition-colors ${
                isSelected
                  ? 'bg-green-50 border-green-500'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex-shrink-0 mr-3">
                {isSelected ? (
                  <CheckSquare className="h-5 w-5 text-green-600" />
                ) : (
                  <Square className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">{model.name}</div>
                <div className="text-xs text-gray-500">{model.provider}</div>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-500">
        Selected: {selectedModels.length} of {availableModels.length} models
      </p>
    </div>
  );
};

export default ModelSelector;
