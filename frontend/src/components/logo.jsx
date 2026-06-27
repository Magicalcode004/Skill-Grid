import React from 'react';

const Logo = () => {
  return (
    <svg width="200" height="50" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}>
      
      <path 
        d="M 20 5 C 10 5 2 13 2 23 C 2 37 20 48 20 48 C 20 48 38 37 38 23 C 38 13 30 5 20 5 Z" 
        fill="#ff9800" 
      />
      
      <g transform="translate(1, 2)">
        <circle cx="19" cy="15" r="4.5" fill="#1a1a1a" />
        <rect x="17.5" y="17" width="3" height="11" rx="1.5" fill="#1a1a1a" transform="rotate(-40 19 19)" />
        <circle cx="16.5" cy="12.5" r="2.5" fill="#ff9800" />
      </g>
     
      <text x="45" y="34" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="24" fill="#ffffff">Skill</text>
      <text x="98" y="34" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="24" fill="#ff9800">Grid</text>
    </svg>
  );
};

export default Logo;