import React from 'react';

const SkillsList = ({ skills = [], techStack = [], maxDisplay = 3 }) => {
  const allSkills = [...new Set([...skills, ...techStack])].slice(0, maxDisplay);
  
  if (allSkills.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-1 justify-center mb-3">
      {allSkills.map((skill, i) => (
        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">
          {skill}
        </span>
      ))}
      {allSkills.length > maxDisplay && (
        <span className="text-xs text-gray-400">+{allSkills.length - maxDisplay}</span>
      )}
    </div>
  );
};

export default SkillsList;