import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import ImageTile from './ImageTile';

interface Image {
  id: string;
  title: string;
  description?: string;
  category: string;
  url: string;
  uploadedAt: any;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  order?: number;
}

interface DraggableImageTileProps {
  image: Image;
  isSelected: boolean;
  onSelect: (imageId: string, selected: boolean) => void;
  onClick?: (image: Image) => void;
  isAdmin: boolean;
  viewMode: 'grid' | 'list';
  index: number;
  isReordering: boolean;
  isDraggingEnabled: boolean;
}

const DraggableImageTile: React.FC<DraggableImageTileProps> = ({
  image,
  isSelected,
  onSelect,
  onClick,
  isAdmin,
  viewMode,
  index,
  isReordering,
  isDraggingEnabled
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: image.id,
    disabled: !isDraggingEnabled || !isAdmin
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${
        isDragging ? 'cursor-grabbing' : 'cursor-default'
      }`}
    >
      {/* Drag Handle - Only show in admin mode when dragging is enabled */}
      {isAdmin && isDraggingEnabled && (
        <div
          {...attributes}
          {...listeners}
          className={`absolute top-2 left-2 z-10 p-1 bg-white bg-opacity-80 rounded-md shadow-sm transition-opacity ${
            isReordering ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          } cursor-grab active:cursor-grabbing`}
          title="Drag to reorder"
        >
          <GripVertical className="h-4 w-4 text-gray-500" />
        </div>
      )}

      {/* Drag Overlay Indicator */}
      {isDragging && (
        <div className="absolute inset-0 border-2 border-blue-500 border-dashed bg-blue-50 bg-opacity-50 rounded-lg flex items-center justify-center">
          <div className="text-blue-600 font-medium">Drop here to reorder</div>
        </div>
      )}

      {/* Original ImageTile */}
      <ImageTile
        image={image}
        isSelected={isSelected}
        onSelect={onSelect}
        onClick={onClick}
        isAdmin={isAdmin}
        viewMode={viewMode}
        index={index}
        isReordering={isReordering}
      />
    </div>
  );
};

export default DraggableImageTile; 