import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import DemographicsSelector from './components/DemographicsSelector';
import ToneValuesSelector from './components/ToneValuesSelector';
import PromptInput from './components/PromptInput';
import ModelSelector from './components/ModelSelector';
import ResultsComparison from './components/ResultsComparison';
import { runModels } from './services/openrouter';

function App() {
  const [demographics, setDemographics] = useState({
    sex: '',
    gender: '',
    age: '',
    education: '',
    race: [],
    regionBirth: '',
    regionResidence: '',
    employment: '',
  });

  const [tone, setTone] = useState('Neutral');
  const [values, setValues] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [selectedModels, setSelectedModels] = useState([
    'anthropic/claude-3.5-sonnet',
    'openai/gpt-4-turbo',
    'openai/gpt-3.5-turbo',
    'google/gemini-pro',
    'meta-llama/llama-3-70b-instruct',
    'mistralai/mistral-large',
  ]);
  const [hideDemographics, setHideDemographics] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState([]);
  const [runHistory, setRunHistory] = useState([]);

  const handleRun = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    if (selectedModels.length === 0) {
      alert('Please select at least one model');
      return;
    }

    setIsRunning(true);
    setResults([]);

    try {
      const modelResults = await runModels({
        demographics: hideDemographics ? null : demographics,
        tone,
        values,
        prompt,
        models: selectedModels,
      });

      setResults(modelResults);
      
      const newRun = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        demographics: hideDemographics ? null : { ...demographics },
        tone,
        values: [...values],
        prompt,
        results: modelResults,
        hideDemographics,
      };
      
      setRunHistory([newRun, ...runHistory]);
    } catch (error) {
      console.error('Error running models:', error);
      alert('Error running models: ' + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleVariantRun = async (changedAttribute, newValue) => {
    const variantDemographics = { ...demographics, [changedAttribute]: newValue };
    
    setIsRunning(true);

    try {
      const modelResults = await runModels({
        demographics: hideDemographics ? null : variantDemographics,
        tone,
        values,
        prompt,
        models: selectedModels,
      });

      const newRun = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        demographics: hideDemographics ? null : variantDemographics,
        tone,
        values: [...values],
        prompt,
        results: modelResults,
        hideDemographics,
        isVariant: true,
        variantOf: runHistory[0]?.id,
        changedAttribute,
      };
      
      setRunHistory([newRun, ...runHistory]);
    } catch (error) {
      console.error('Error running variant:', error);
      alert('Error running variant: ' + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Demography & Model Fairness Playground
          </h1>
          <p className="text-gray-600 text-lg">
            Explore how AI models respond to the same prompt across different demographic contexts
          </p>
        </div>

        {/* Educational Purpose Banner */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-r-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-800">
                <strong>Educational Purpose Only:</strong> This tool is designed for classroom exploration 
                of AI model behavior and potential biases. It is NOT intended for medical, legal, or financial 
                advice. All demographic information is used only to construct prompts and is not stored.
              </p>
            </div>
          </div>
        </div>

        {/* Main Configuration Panel */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <DemographicsSelector 
                demographics={demographics}
                onChange={setDemographics}
              />
              
              <ToneValuesSelector
                tone={tone}
                values={values}
                onToneChange={setTone}
                onValuesChange={setValues}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <PromptInput
                prompt={prompt}
                onChange={setPrompt}
              />
              
              <ModelSelector
                selectedModels={selectedModels}
                onChange={setSelectedModels}
              />

              {/* Control Options */}
              <div className="border-t pt-4">
                <label className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hideDemographics}
                    onChange={(e) => setHideDemographics(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Hide demographics from models (control condition)</span>
                </label>
              </div>

              {/* Run Button */}
              <button
                onClick={handleRun}
                disabled={isRunning || !prompt.trim() || selectedModels.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Running Models...</span>
                  </>
                ) : (
                  <span>Run Comparison</span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {runHistory.length > 0 && (
          <ResultsComparison
            runs={runHistory}
            onVariantRun={handleVariantRun}
            isRunning={isRunning}
          />
        )}
      </div>
    </div>
  );
}

export default App;
