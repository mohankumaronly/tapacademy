import React, { forwardRef } from 'react';
import { Search, X } from 'lucide-react';

const SearchInput = forwardRef(({
  value,
  onChange,
  onClear,
  onFocus,
  isLoading,
  showClear = true,
  placeholder = "Search...",
  className = "",
  ...props
}, ref) => {
  return (
    <div className="relative group">
      <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
        value ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
      }`} />
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        className={`w-full bg-white border border-gray-200 rounded-full pl-12 pr-12 py-4 text-base outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:shadow-lg transition-all ${className}`}
        {...props}
      />
      {value && showClear && (
        <button
          onClick={onClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={18} className="text-gray-400" />
        </button>
      )}
      {isLoading && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput';
export default SearchInput;