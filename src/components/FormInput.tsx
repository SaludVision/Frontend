import { useState } from "react";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  showValidation?: boolean;
}

export function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  error,
  value,
  onChange,
  className = "",
  showValidation = false,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;
  const hasValue = value.length > 0;
  const isValid = hasValue && !error && showValidation;

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      <label htmlFor={name} className="flex items-center gap-1 text-gray-700 transition-colors">
        <span>{label}</span>
        {required && (
          <span className="text-red-500">*</span>
        )}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`bg-white w-full h-12 px-4 ${isPassword || isValid ? 'pr-12' : 'pr-4'} rounded-lg border-2 text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all ${
            error 
              ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
              : isFocused
              ? 'border-blue-500 ring-4 ring-blue-100'
              : hasValue && showValidation
              ? 'border-green-400 focus:border-green-500 focus:ring-4 focus:ring-green-100'
              : 'border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100'
          }`}
          required={required}
        />
        
        {/* Password toggle or validation icon */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
        
        {!isPassword && isValid && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-start gap-2 text-red-500 text-sm animate-in slide-in-from-top-1 duration-200">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
