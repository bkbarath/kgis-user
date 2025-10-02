// MultiSelectDropdown.tsx (updated for React Hook Form compatibility)
import React, { useEffect, useRef, useState } from "react";
import IconComponent from "../../assets/icons/IconComponent";
import type { OptionItem } from "../../lib/types/common.type";

interface MultiSelectDropdownProps {
  options: OptionItem[];
  value?: string[];
  onChange?: (value: string[]) => void;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  maxDisplayed?: number;
  className?: string;
  searchable?: boolean;
  label?: string;
  // React Hook Form specific props
  onBlur?: () => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  value = [],
  onChange,
  name,
  placeholder = "Select options...",
  disabled = false,
  maxDisplayed = 3,
  className = "",
  searchable = true,
  label,
  onBlur,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected options objects
  const selectedOptions = options.filter((option) =>
    value.includes(option.value)
  );

  // Handle option selection
  const handleSelect = (optionValue: string) => {
    if (disabled) return;

    const isSelected = value.includes(optionValue);
    let newValue: string[];

    if (isSelected) {
      newValue = value.filter((val) => val !== optionValue);
    } else {
      newValue = [...value, optionValue];
    }

    onChange?.(newValue);
    setSearchTerm("");
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        setSearchTerm("");
        onBlur?.();
        break;
      case "Tab":
        setIsOpen(false);
        onBlur?.();
        break;
    }
  };

  // Remove a selected option
  const removeOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = value.filter((val) => val !== optionValue);
    onChange?.(newValue);
  };

  // Clear all selections
  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.([]);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        onBlur?.();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBlur]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filteredOptions]);

  return (
    <div className="space-y-2 w-full">
      <label className="text-sm font-semibold">{label}</label>
      <div ref={dropdownRef} className={`relative w-full ${className}`}>
        {/* Hidden input for React Hook Form */}
        {name && (
          <input
            type="hidden"
            name={name}
            value={JSON.stringify(value)}
            onChange={() => {}}
          />
        )}

        {/* Trigger Button */}
        <div
          className={`
          min-h-12 w-full px-3 py-2 border border-muted-foreground rounded-lg 
          bg-background cursor-pointer transition-colors
          ${
            disabled
              ? "bg-muted-foreground cursor-not-allowed opacity-60"
              : "hover:border-muted-foreground"
          }
          ${isOpen ? "ring-1 ring-primary-purple" : ""}
        `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onBlur={onBlur}
        >
          <div className="flex flex-wrap gap-1">
            {/* Selected Options Pills */}
            {selectedOptions.slice(0, maxDisplayed).map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center px-1 bg-primary-purple/5 text-primary-purple text-sm rounded-full border border-primary-purple/20"
              >
                {option.label}
                {!disabled && (
                  <IconComponent
                    iconName={"cancel"}
                    onClick={(e) => removeOption(option.value, e)}
                    className="ml-1 text-primary-purple/50 hover:text-primary-purple focus:outline-none"
                  />
                )}
              </span>
            ))}

            {/* More items indicator */}
            {selectedOptions.length > maxDisplayed && (
              <span className="inline-flex items-center px-2 py-1 bg-muted-background text-muted-foreground text-sm rounded-full">
                +{selectedOptions.length - maxDisplayed} more
              </span>
            )}

            {/* Placeholder when no selections */}
            {selectedOptions.length === 0 && (
              <span className="text-muted-foreground text-sm py-1">
                {placeholder}
              </span>
            )}
          </div>

          {/* Dropdown Indicators */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {selectedOptions.length > 0 && !disabled && (
              <IconComponent iconName={"cancel"} onClick={clearAll} />
            )}
            <IconComponent
              iconName={"downArrow"}
              className={`w-4 h-4 text-muted-foreground transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-background border border-muted-foreground rounded-lg shadow-lg overflow-hidden">
            {/* Search Input */}
            {searchable && (
              <div className="p-2 border-b border-muted-foreground">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search options..."
                  className="w-full px-3 py-2 border border-muted-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent"
                />
              </div>
            )}

            {/* Options List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-muted-foreground text-center">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = value.includes(option.value);
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <div
                      key={option.value}
                      className={`
                      px-3 py-2 cursor-pointer transition-colors flex items-center
                      ${
                        option.disabled
                          ? "text-muted-foreground/20 cursor-not-allowed bg-muted-background/50"
                          : isHighlighted
                          ? "bg-primary-purple text-background"
                          : "hover:bg-muted-background/30"
                      }
                    `}
                      onClick={() =>
                        !option.disabled && handleSelect(option.value)
                      }
                      onMouseEnter={() =>
                        !option.disabled && setHighlightedIndex(index)
                      }
                    >
                      {/* Checkbox */}
                      <div
                        className={`
                      w-4 h-4 border rounded mr-3 flex items-center justify-center
                      ${
                        option.disabled
                          ? "border-muted-background bg-muted-background"
                          : isSelected
                          ? "bg-primary-purple border-primary-purple"
                          : "border-muted-background"
                      }
                      ${
                        isHighlighted && !option.disabled
                          ? "border-background"
                          : ""
                      }
                    `}
                      >
                        {isSelected && (
                          <IconComponent
                            iconName={"check"}
                            className="w-3 h-3 text-background"
                          />
                        )}
                      </div>

                      {/* Option Label */}
                      <span className={option.disabled ? "opacity-60" : ""}>
                        {option.label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Selected Count */}
            {selectedOptions.length > 0 && (
              <div className="px-3 py-2 bg-muted-background border-t border-muted-background text-sm text-muted-foreground">
                {selectedOptions.length} option
                {selectedOptions.length !== 1 ? "s" : ""} selected
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
