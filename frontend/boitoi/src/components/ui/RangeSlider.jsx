import React, { useState, useRef, useEffect, useCallback } from 'react';

const RangeSlider = ({ 
  min = 0, 
  max = 1000, 
  step = 1, 
  value = { min: 0, max: 1000 }, 
  onChange,
  formatValue = (val) => `$${val}`,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(null);
  const sliderRef = useRef(null);

  const getPercentage = useCallback((value) => {
    return ((value - min) / (max - min)) * 100;
  }, [min, max]);

  const getValue = useCallback((percentage) => {
    const rawValue = min + (percentage / 100) * (max - min);
    return Math.round(rawValue / step) * step;
  }, [min, max, step]);

  const handleMouseDown = (thumb) => (e) => {
    e.preventDefault();
    setIsDragging(thumb);
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newValue = getValue(percentage);

    if (isDragging === 'min') {
      const newMin = Math.min(newValue, value.max);
      onChange({ ...value, min: newMin });
    } else if (isDragging === 'max') {
      const newMax = Math.max(newValue, value.min);
      onChange({ ...value, max: newMax });
    }
  }, [isDragging, getValue, value, onChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const minPercentage = getPercentage(value.min);
  const maxPercentage = getPercentage(value.max);

  return (
    <div className={`w-full ${className}`}>
      {/* Value Display */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium text-gray-700">
          {formatValue(value.min)}
        </div>
        <div className="text-sm text-gray-500">to</div>
        <div className="text-sm font-medium text-gray-700">
          {formatValue(value.max)}
        </div>
      </div>

      {/* Slider Track */}
      <div 
        ref={sliderRef}
        className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
        style={{ userSelect: 'none' }}
      >
        {/* Active Range */}
        <div
          className="absolute h-2 bg-primary-600 rounded-full"
          style={{
            left: `${minPercentage}%`,
            width: `${maxPercentage - minPercentage}%`
          }}
        />

        {/* Min Thumb */}
        <div
          className={`absolute w-5 h-5 bg-white border-2 border-primary-600 rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1/2 top-1/2 shadow-md transition-all duration-150 ${
            isDragging === 'min' ? 'scale-110 shadow-lg cursor-grabbing' : 'hover:scale-105'
          }`}
          style={{ left: `${minPercentage}%` }}
          onMouseDown={handleMouseDown('min')}
        />

        {/* Max Thumb */}
        <div
          className={`absolute w-5 h-5 bg-white border-2 border-primary-600 rounded-full cursor-grab transform -translate-x-1/2 -translate-y-1/2 top-1/2 shadow-md transition-all duration-150 ${
            isDragging === 'max' ? 'scale-110 shadow-lg cursor-grabbing' : 'hover:scale-105'
          }`}
          style={{ left: `${maxPercentage}%` }}
          onMouseDown={handleMouseDown('max')}
        />
      </div>

      {/* Min/Max Labels */}
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-500">{formatValue(min)}</span>
        <span className="text-xs text-gray-500">{formatValue(max)}</span>
      </div>
    </div>
  );
};

export default RangeSlider;
