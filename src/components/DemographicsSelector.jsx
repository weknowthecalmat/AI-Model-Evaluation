import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

const DemographicsSelector = ({ demographics, onChange }) => {
  const [showOptional, setShowOptional] = useState(false);

  const handleChange = (field, value) => {
    onChange({ ...demographics, [field]: value });
  };

  const handleRaceToggle = (race) => {
    const currentRaces = demographics.race || [];
    const newRaces = currentRaces.includes(race)
      ? currentRaces.filter(r => r !== race)
      : [...currentRaces, race];
    handleChange('race', newRaces);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Demographics</h2>
        <div className="flex items-center text-xs text-gray-500">
          <Info className="h-3 w-3 mr-1" />
          <span>Used only to explore model behavior; not stored</span>
        </div>
      </div>

      {/* Sex (Biological) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sex (Biological)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['Male', 'Female', 'Intersex', 'Prefer not to say'].map((option) => (
            <button
              key={option}
              onClick={() => handleChange('sex', option)}
              className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                demographics.sex === option
                  ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Gender Identity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gender Identity
        </label>
        <div className="grid grid-cols-2 gap-2">
          {['Man', 'Woman', 'Non-binary', 'Prefer not to say'].map((option) => (
            <button
              key={option}
              onClick={() => handleChange('gender', option)}
              className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                demographics.gender === option
                  ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Age */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Age
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['18–24', '25–34', '35–44', '45–54', '55–64', '65+'].map((option) => (
            <button
              key={option}
              onClick={() => handleChange('age', option)}
              className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                demographics.age === option
                  ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Education
        </label>
        <select
          value={demographics.education}
          onChange={(e) => handleChange('education', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select education level</option>
          <option value="Less than HS">Less than High School</option>
          <option value="HS/GED">High School / GED</option>
          <option value="Some College">Some College</option>
          <option value="Bachelor's">Bachelor's Degree</option>
          <option value="Graduate/Professional">Graduate / Professional Degree</option>
        </select>
      </div>

      {/* Optional Fields Toggle */}
      <button
        onClick={() => setShowOptional(!showOptional)}
        className="flex items-center text-sm text-indigo-600 hover:text-indigo-700 font-medium"
      >
        {showOptional ? (
          <>
            <ChevronUp className="h-4 w-4 mr-1" />
            Hide optional fields
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4 mr-1" />
            Show optional fields (Race, Region, Employment)
          </>
        )}
      </button>

      {/* Optional Fields */}
      {showOptional && (
        <div className="space-y-4 pt-2 border-t">
          {/* Race/Ethnicity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Race/Ethnicity (multi-select)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'American Indian/Alaska Native',
                'Asian',
                'Black/African American',
                'Hispanic/Latino',
                'Native Hawaiian/Pacific Islander',
                'White',
                'Other',
                'Prefer not to say',
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => handleRaceToggle(option)}
                  className={`px-3 py-2 text-xs rounded-md border transition-colors text-left ${
                    demographics.race?.includes(option)
                      ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Region of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Region of Birth
            </label>
            <input
              type="text"
              value={demographics.regionBirth}
              onChange={(e) => handleChange('regionBirth', e.target.value)}
              placeholder="e.g., North America, Europe, Asia"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Region of Residence */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Region of Residence
            </label>
            <input
              type="text"
              value={demographics.regionResidence}
              onChange={(e) => handleChange('regionResidence', e.target.value)}
              placeholder="e.g., California, USA"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Employment Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Employment Status
            </label>
            <select
              value={demographics.employment}
              onChange={(e) => handleChange('employment', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select employment status</option>
              <option value="Employed full-time">Employed full-time</option>
              <option value="Employed part-time">Employed part-time</option>
              <option value="Self-employed">Self-employed</option>
              <option value="Unemployed">Unemployed</option>
              <option value="Student">Student</option>
              <option value="Retired">Retired</option>
              <option value="Unable to work">Unable to work</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default DemographicsSelector;
