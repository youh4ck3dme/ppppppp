import React from 'react';

interface ProgressBarProps {
  isLoading: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ isLoading }) => {
  return (
    <div
      className={`fixed top-0 left-0 right-0 h-1 z-[999] transition-opacity duration-300 ease-in-out ${
        isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`h-full bg-[var(--color-accent)] shadow-lg transition-transform origin-left duration-1000 ease-out ${
            isLoading ? 'scale-x-100' : 'scale-x-0'
        }`}
        style={{
            transitionDuration: isLoading ? '1500ms' : '200ms'
        }}
      />
    </div>
  );
};

export default ProgressBar;