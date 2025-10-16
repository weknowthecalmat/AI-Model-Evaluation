import React from 'react';
import { User } from 'lucide-react';

const DemographicStamp = ({ demographics, tone, values, hideDemographics }) => {
  if (hideDemographics) {
    return (
      <div className="flex items-center p-3 bg-gray-100 rounded-md border border-gray-300">
        <User className="h-5 w-5 text-gray-500 mr-2" />
        <span className="text-sm font-medium text-gray-700">
          Demographics hidden (control condition)
        </span>
      </div>
    );
  }

  const parts = [];

  if (demographics.sex) parts.push(`Sex: ${demographics.sex}`);
  if (demographics.gender) parts.push(`Gender: ${demographics.gender}`);
  if (demographics.age) parts.push(`Age: ${demographics.age}`);
  if (demographics.education) parts.push(`Education: ${demographics.education}`);
  if (demographics.race && demographics.race.length > 0) {
    parts.push(`Race: ${demographics.race.join(', ')}`);
  }
  if (demographics.regionBirth) parts.push(`Birth: ${demographics.regionBirth}`);
  if (demographics.regionResidence) parts.push(`Residence: ${demographics.regionResidence}`);
  if (demographics.employment) parts.push(`Employment: ${demographics.employment}`);
  if (tone) parts.push(`Tone: ${tone}`);
  if (values && values.length > 0) {
    parts.push(`Priorities: ${values.join(', ')}`);
  }

  return (
    <div className="flex items-start p-4 bg-indigo-50 rounded-md border border-indigo-200">
      <User className="h-5 w-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <div className="text-sm font-medium text-indigo-900 mb-1">
          Demographic & Style Context
        </div>
        <div className="text-sm text-indigo-700 flex flex-wrap gap-2">
          {parts.map((part, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-white rounded border border-indigo-200"
            >
              {part}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemographicStamp;
