import React, { useState } from 'react';
import { X } from 'lucide-react';

const VariantRunModal = ({ demographics, onRun, onClose }) => {
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [newValue, setNewValue] = useState('');

  const attributes = [
    { key: 'sex', label: 'Sex (Biological)', options: ['Male', 'Female', 'Intersex', 'Prefer not to say'] },
    { key: 'gender', label: 'Gender Identity', options: ['Man', 'Woman', 'Non-binary', 'Prefer not to say'] },
    { key: 'age', label: 'Age', options: ['18–24', '25–34', '35–44', '45–54', '55–64', '65+'] },
    { 
      key: 'education', 
      label: 'Education', 
      options: ['Less than HS', 'HS/GED', 'Some College', "Bachelor's", 'Graduate/Professional'] 
    },
  ];

  const handleRun = () => {
    if (!selectedAttribute || !newValue) {
      alert('Please select an attribute and a new value');
      return;
    }
    onRun(selectedAttribute, newValue);
    onClose();
  };

  const currentAttribute = attributes.find(a => a.key === selectedAttribute);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Run Variant with Changed Demographic
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Select one demographic attribute to change and compare the results.
        </p>

        {/* Attribute Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attribute to Change
          </label>
          <select
            value={selectedAttribute}
            onChange={(e) => {
              setSelectedAttribute(e.target.value);
              setNewValue('');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select attribute...</option>
            {attributes.map((attr) => (
              <option key={attr.key} value={attr.key}>
                {attr.label} (current: {demographics[attr.key] || 'not set'})
              </option>
            ))}
          </select>
        </div>

        {/* New Value Selection */}
        {selectedAttribute && currentAttribute && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Value
            </label>
            <div className="grid grid-cols-2 gap-2">
              {currentAttribute.options.map((option) => (
                <button
                  key={option}
                  onClick={() => setNewValue(option)}
                  disabled={demographics[selectedAttribute] === option}
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                    newValue === option
                      ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                      : demographics[selectedAttribute] === option
                      ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option}
                  {demographics[selectedAttribute] === option && ' (current)'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRun}
            disabled={!selectedAttribute || !newValue}
            className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-md transition-colors"
          >
            Run Variant
          </button>
        </div>
      </div>
    </div>
  );
};

export default VariantRunModal;
