// AutocompleteDropdown.tsx
import React, { useEffect, useRef, useState, type HTMLProps } from "react";
import type { OptionItem } from "../../lib/types/common.type";
import IconComponent from "../../assets/icons/IconComponent";

type AutocompleteDropdownProps = HTMLProps<HTMLInputElement> & {
  label?: string;
  options: OptionItem[];
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (option: OptionItem) => void;
  placeholder?: string;
  disabled?: boolean;
  maxHeight?: string;
  className?: string;
};

const AutocompleteDropdown: React.FC<AutocompleteDropdownProps> = ({
  label,
  options,
  value = "",
  onChange,
  onSelect,
  placeholder = "Type to search...",
  disabled = false,
  maxHeight = "200px",
  className = "",
  ...props
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on input value
  const filteredOptions = (options ?? []).filter(
    (option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
      option.value.toString().toLowerCase().includes(inputValue.toLowerCase())
  );

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  // Handle option selection
  const handleSelect = (option: OptionItem) => {
    setInputValue(option.label);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onSelect?.(option);
    onChange?.(option.value);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync with external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="space-y-2 w-full">
      <label htmlFor={props.name} className="text-sm font-semibold">
        {label}
      </label>
      <div ref={dropdownRef} className={`relative w-full ${className}`}>
        {/* Input Field */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            {...props}
            className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary-purple focus:border-transparent disabled:bg-muted-background disabled:cursor-not-allowed"
          />

          {/* Clear Button */}
          {inputValue && !disabled && (
            <IconComponent
              iconName={"cancel"}
              onClick={() => {
                setInputValue("");
                onChange?.("");
                setIsOpen(false);
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            />
          )}
        </div>

        {/* Dropdown Menu */}
        {isOpen && filteredOptions.length > 0 && (
          <div
            className="absolute z-10 w-full mt-1 bg-background border border-muted-background rounded-lg shadow-lg overflow-hidden"
            style={{ maxHeight }}
          >
            <div className="overflow-y-auto">
              {filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`px-3 py-2 cursor-pointer transition-colors ${
                    index === highlightedIndex
                      ? "bg-primary-purple/80 text-background"
                      : "hover:bg-gray-100"
                  }`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {isOpen && inputValue && filteredOptions.length === 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="px-3 py-2 text-gray-500 text-center">
              No results found
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutocompleteDropdown;
