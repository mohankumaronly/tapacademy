import React from 'react';

const PopularTerms = ({ terms = [], onTermClick }) => {
  const defaultTerms = ["Developer", "Designer", "Mentor", "Student", "Teacher"];
  const displayTerms = terms.length ? terms : defaultTerms;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
      <span className="text-sm text-gray-400">Popular:</span>
      {displayTerms.map((term) => (
        <button
          key={term}
          onClick={() => onTermClick(term)}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
        >
          {term}
        </button>
      ))}
    </div>
  );
};

export default PopularTerms;