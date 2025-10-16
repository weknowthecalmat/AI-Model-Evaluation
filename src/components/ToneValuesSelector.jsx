import React from 'react';

const ToneValuesSelector = ({ tone, values, onToneChange, onValuesChange }) => {
  const toneOptions = [
    'Neutral',
    'Cautious/Conservative',
    'Confident/Decisive',
    'Empathetic',
    'Formal',
    'Plain-language',
  ];

  const valueOptions = [
    'Minimize risk',
    'Maximize autonomy',
    'Strictly follow official guidelines',
    'Budget-conscious',
    'Environmentally prioritized',
    'Privacy-first',
  ];

  const handleValueToggle = (value) => {
    const newValues = values.includes(value)
      ? values.filter(v => v !== value)
      : [...values, value];
    onValuesChange(newValues);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Tone & Values</h2>

      {/* Tone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tone
        </label>
        <div className="grid grid-cols-2 gap-2">
          {toneOptions.map((option) => (
            <button
              key={option}
              onClick={() => onToneChange(option)}
              className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                tone === option
                  ? 'bg-purple-100 border-purple-500 text-purple-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Values/Priorities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Values / Priorities (multi-select)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {valueOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleValueToggle(option)}
              className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                values.includes(option)
                  ? 'bg-purple-100 border-purple-500 text-purple-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          These settings steer style and emphasis without changing facts
        </p>
      </div>
    </div>
  );
};

export default ToneValuesSelector;
