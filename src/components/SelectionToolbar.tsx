import React from 'react';
import { Trash2, X } from 'lucide-react';

interface SelectionToolbarProps {
  selectedCount: number;
  onDelete: () => void;
  onDeselectAll: () => void;
}

const SelectionToolbar: React.FC<SelectionToolbarProps> = ({
  selectedCount,
  onDelete,
  onDeselectAll
}) => {
  return (
    <div className="sticky top-20 z-40 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="font-medium">
            {selectedCount} image{selectedCount !== 1 ? 's' : ''} selected
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={onDeselectAll}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Deselect All</span>
          </button>
          
          <button
            onClick={onDelete}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Selected</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionToolbar; 