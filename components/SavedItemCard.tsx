import React, { useState, useRef, useEffect } from 'react';
import { SavedItem, Folder } from '../types';
import Tag from './Tag';
import { TrashIcon, MoreHorizontalIcon, FolderIcon } from './icons';
import { Timestamp } from 'firebase/firestore';

interface SavedItemCardProps {
  item: SavedItem;
  onDelete: (id: string) => void;
  folders: Folder[];
  onMoveItemToFolder: (itemId: string, folderId: string) => void;
}

const SavedItemCard: React.FC<SavedItemCardProps> = ({ item, onDelete, folders, onMoveItemToFolder }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleMove = (folderId: string) => {
    onMoveItemToFolder(item.id, folderId);
    setMenuOpen(false);
  };

  const timeAgo = (date: string | Timestamp): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date.toDate();
    const seconds = Math.floor((new Date().getTime() - dateObj.getTime()) / 1000);
    if (seconds < 5) return "just now";
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
  };
    
  return (
    <div className="bg-secondary rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
      <img src={item.thumbnailUrl} alt="Thumbnail" className="w-full h-40 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-words block">
                  {item.url}
                </a>
                <p className="text-sm text-medium mt-1">{item.description}</p>
            </div>
            <div className="relative ml-2 flex-shrink-0" ref={menuRef}>
                <button
                    onClick={() => setMenuOpen(!isMenuOpen)}
                    className="text-medium hover:text-light transition-colors p-1"
                    aria-label="More options"
                >
                    <MoreHorizontalIcon />
                </button>
                {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-primary border border-gray-700 rounded-md shadow-lg z-10">
                        <div className="py-1">
                            <p className="px-3 py-1 text-xs text-medium">Move to</p>
                            <button onClick={() => handleMove('uncategorized')} className="w-full text-left px-3 py-2 text-sm text-light hover:bg-gray-700 flex items-center">
                                <FolderIcon /> <span className="ml-2">Uncategorized</span>
                            </button>
                            {folders.map(folder => (
                                <button key={folder.id} onClick={() => handleMove(folder.id)} className="w-full text-left px-3 py-2 text-sm text-light hover:bg-gray-700 flex items-center">
                                    <FolderIcon /> <span className="ml-2">{folder.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <button
              onClick={() => onDelete(item.id)}
              className="text-medium hover:text-red-400 transition-colors p-1"
              aria-label="Delete item"
            >
              <TrashIcon />
            </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {item.tags.map(tag => <Tag key={tag} label={tag} />)}
        </div>
        <p className="text-xs text-medium mt-3 text-right">{timeAgo(item.createdAt)}</p>
      </div>
    </div>
  );
};

export default SavedItemCard;