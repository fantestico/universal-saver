
import React from 'react';

interface TagProps {
  label: string;
}

const Tag: React.FC<TagProps> = ({ label }) => {
  return (
    <span className="bg-gray-700 text-light text-xs font-semibold px-2.5 py-1 rounded-full">
      {label}
    </span>
  );
};

export default Tag;
