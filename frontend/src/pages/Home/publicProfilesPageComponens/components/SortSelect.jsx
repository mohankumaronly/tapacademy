import React from 'react';

const SortSelect = ({ value, onChange, options = [] }) => {
  const defaultOptions = [
    { value: 'relevant', label: 'Most Relevant' },
    { value: 'recent', label: 'Recently Active' },
    { value: 'alphabetical', label: 'Alphabetical' }
  ];

  const selectOptions = options.length ? options : defaultOptions;

  return (
    <select 
      value={value}
      onChange={onChange}
      className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
    >
      {selectOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SortSelect;