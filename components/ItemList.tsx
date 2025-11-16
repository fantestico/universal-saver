
import React from 'react';
import { SavedItem, Folder } from '../types';
import SavedItemCard from './SavedItemCard';

interface ItemListProps {
  items: SavedItem[];
  onDelete: (id: string) => void;
  folders: Folder[];
  onMoveItemToFolder: (itemId: string, folderId: string) => void;
}

const ItemList: React.FC<ItemListProps> = ({ items, onDelete, folders, onMoveItemToFolder }) => {
  if (items.length === 0) {
    return (
      <div className="text-center text-medium py-10">
        <p className="text-lg">No items in this view.</p>
        <p>Save a new link or check another folder!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map(item => (
        <SavedItemCard
          key={item.id}
          item={item}
          onDelete={onDelete}
          folders={folders}
          onMoveItemToFolder={onMoveItemToFolder}
        />
      ))}
    </div>
  );
};

export default ItemList;