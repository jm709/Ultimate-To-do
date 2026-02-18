import { Circle, CheckCircle2 } from 'lucide-react';
import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:cursor-not-allowed"
      />
      {label && <span className="text-gray-700">{label}</span>}
    </label>
  );
};

export const CircleCheck: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <label className="flex items-center cursor-pointer">
      <input type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      className="hidden"
      />
      {checked ? ( 
        <CheckCircle2
         size={20}
         className="text-green-400 transition-colors"
          />
        ) : (
          <Circle
          size={20}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          />
        )
      }
    </label>
  );
};
