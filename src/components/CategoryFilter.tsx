import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  color?: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  showDropdown?: boolean;
  showBubbles?: boolean;
  className?: string;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  showDropdown = true,
  showBubbles = true,
  className = ''
}) => {
  const handleCategorySelect = (categoryId: string | null) => {
    onCategoryChange(categoryId);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Dropdown Filter */}
      {showDropdown && (
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <div className="relative">
            <select
              value={selectedCategory || 'all'}
              onChange={(e) => handleCategorySelect(e.target.value === 'all' ? null : e.target.value)}
              className="appearance-none px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Bubble Filter Pills */}
      {showBubbles && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleCategorySelect(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === null
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilter; 