import React, { useState } from 'react';
import { 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  Download, 
  Eye, 
  EyeOff,
  AlertCircle,
  Clock,
  FileText,
  RefreshCw
} from 'lucide-react';
import DemographicStamp from './DemographicStamp';
import VariantRunModal from './VariantRunModal';

const ResultsComparison = ({ runs, onVariantRun, isRunning }) => {
  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [feedback, setFeedback] = useState({});

  const latestRun = runs[0];

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleFeedback = (modelId, type) => {
    setFeedback({
      ...feedback,
      [modelId]: type,
    });
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(runs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `model-comparison-${Date.now()}.json`;
    link.click();
  };

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Model', 'Response', 'Latency (ms)', 'Tokens', 'Demographics', 'Tone', 'Values', 'Prompt'];
    const rows = runs.flatMap(run =>
      run.results.map(result => [
        run.timestamp,
        result.model,
        `"${result.response.replace(/"/g, '""')}"`,
        result.latency,
        result.tokens,
        run.hideDemographics ? 'Hidden' : JSON.stringify(run.demographics),
        run.tone,
        run.values.join('; '),
        `"${run.prompt.replace(/"/g, '""')}"`,
      ])
    );

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `model-comparison-${Date.now()}.csv`;
    link.click();
  };

  // Analyze disagreements
  const analyzeDisagreements = (results) => {
    const yesNoPattern = /\b(yes|no)\b/i;
    const numberPattern = /\$?\d+(?:,\d{3})*(?:\.\d+)?/g;
    
    const yesNoAnswers = results.map(r => {
      const match = r.response.match(yesNoPattern);
      return match ? match[0].toLowerCase() : null;
    }).filter(Boolean);

    const numbers = results.flatMap(r => {
      const matches = r.response.match(numberPattern);
      return matches ? matches.map(n => parseFloat(n.replace(/[$,]/g, ''))) : [];
    }).filter(n => !isNaN(n));

    const disagreements = [];

    // Check Yes/No disagreements
    if (yesNoAnswers.length > 1) {
      const uniqueAnswers = [...new Set(yesNoAnswers)];
      if (uniqueAnswers.length > 1) {
        disagreements.push({
          type: 'Yes/No',
          details: `Models disagree: ${uniqueAnswers.join(' vs ')}`,
        });
      }
    }

    // Check numeric disagreements
    if (numbers.length > 1) {
      const min = Math.min(...numbers);
      const max = Math.max(...numbers);
      const median = numbers.sort((a, b) => a - b)[Math.floor(numbers.length / 2)];
      
      if (max - min > min * 0.1) { // More than 10% variance
        // Check if numbers appear to be currency (have $ in original text)
        const hasDollarSign = results.some(r => r.response.includes('$'));
        const prefix = hasDollarSign ? '$' : '';
        
        disagreements.push({
          type: 'Numeric',
          details: `Range: ${prefix}${min.toLocaleString()} - ${prefix}${max.toLocaleString()} (Median: ${prefix}${median.toLocaleString()})`,
        });
      }
    }

    return disagreements;
  };

  const disagreements = analyzeDisagreements(latestRun.results);

  return (
    <div className="space-y-6">
      {/* Run Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Results</h2>
            <p className="text-sm text-gray-500">
              Run at {new Date(latestRun.timestamp).toLocaleString()}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowVariantModal(true)}
              disabled={isRunning}
              className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-md transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Run Variant
            </button>
            <button
              onClick={exportToJSON}
              className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              JSON
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-md transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </button>
          </div>
        </div>

        {/* Demographic Stamp */}
        <DemographicStamp
          demographics={latestRun.demographics}
          tone={latestRun.tone}
          values={latestRun.values}
          hideDemographics={latestRun.hideDemographics}
        />

        {/* Prompt Display */}
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <div className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FileText className="h-4 w-4 mr-1" />
            Prompt
          </div>
          <p className="text-sm text-gray-800">{latestRun.prompt}</p>
        </div>

        {/* Disagreements Summary */}
        {disagreements.length > 0 && (
          <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-md">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-amber-900 mb-1">
                  Key Disagreements Detected
                </h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  {disagreements.map((d, i) => (
                    <li key={i}>
                      <strong>{d.type}:</strong> {d.details}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Highlight Toggle */}
        <div className="mt-4 flex items-center">
          <button
            onClick={() => setHighlightDifferences(!highlightDifferences)}
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            {highlightDifferences ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                Hide differences
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" />
                Highlight differences
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {latestRun.results.map((result) => (
          <div
            key={result.model}
            className="bg-white rounded-lg shadow-md p-5 flex flex-col"
          >
            {/* Model Header */}
            <div className="mb-3 pb-3 border-b">
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                {result.modelName || result.model}
              </h3>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {result.latency}ms
                </div>
                <div className="flex items-center">
                  <FileText className="h-3 w-3 mr-1" />
                  {result.tokens} tokens
                </div>
              </div>
            </div>

            {/* Response */}
            <div className="flex-1 mb-4">
              {result.error ? (
                <div className="text-red-600 text-sm">
                  <strong>Error:</strong> {result.error}
                </div>
              ) : (
                <p className={`text-sm text-gray-700 whitespace-pre-wrap ${
                  highlightDifferences ? 'leading-relaxed' : ''
                }`}>
                  {result.response}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleCopy(result.response)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  title="Copy"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleFeedback(result.model, 'up')}
                  className={`p-2 rounded transition-colors ${
                    feedback[result.model] === 'up'
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-600 hover:text-green-600 hover:bg-gray-100'
                  }`}
                  title="Thumbs up"
                >
                  <ThumbsUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleFeedback(result.model, 'down')}
                  className={`p-2 rounded transition-colors ${
                    feedback[result.model] === 'down'
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-600 hover:text-red-600 hover:bg-gray-100'
                  }`}
                  title="Thumbs down"
                >
                  <ThumbsDown className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleFeedback(result.model, 'flag')}
                  className={`p-2 rounded transition-colors ${
                    feedback[result.model] === 'flag'
                      ? 'text-orange-600 bg-orange-50'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-gray-100'
                  }`}
                  title="Flag as potentially biased"
                >
                  <Flag className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Previous Runs */}
      {runs.length > 1 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Previous Runs ({runs.length - 1})
          </h3>
          <div className="space-y-3">
            {runs.slice(1).map((run, index) => (
              <div
                key={run.id}
                className="p-4 bg-gray-50 rounded-md border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-1">
                      {new Date(run.timestamp).toLocaleString()}
                      {run.isVariant && (
                        <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                          Variant: {run.changedAttribute}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-700 line-clamp-2">{run.prompt}</p>
                  </div>
                  <div className="text-xs text-gray-500 ml-4">
                    {run.results.length} models
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Variant Run Modal */}
      {showVariantModal && (
        <VariantRunModal
          demographics={latestRun.demographics}
          onRun={onVariantRun}
          onClose={() => setShowVariantModal(false)}
        />
      )}
    </div>
  );
};

export default ResultsComparison;
