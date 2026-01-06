import React from 'react';
import './Recording.css';

const DescriptionInput = ({
  value,
  onChange,
  maxLength = 150,
  placeholder = "E.g., My thoughts on quality of life...",
  label = "Add a short description",
  className = ""
}) => {
  const handleChange = (e) => {
    const newValue = e.target.value.slice(0, maxLength);
    onChange(newValue);
  };

  return (
    <div className={`description-input ${className}`}>
      <label className="description-input__label">{label}</label>
      <div className="description-input__wrapper">
        <input
          type="text"
          className="description-input__field"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
        />
        <span className="description-input__count">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};

export default DescriptionInput;
