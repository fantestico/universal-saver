import React, { useState } from 'react';
import { Folder } from '../types';
import { PlusIcon, CloseIcon } from './icons';

interface FolderNavigationProps {
  folders: Folder[];
  selectedFolderId: string;
  onSelectFolder: (id: string) => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (id: string) => void;
}

const FolderButton: React.FC<{
  label: string;
  isSelected: boolean;
  onClick: () => void;
  onDelete?: () => void;
}> = ({ label, isSelected, onClick, onDelete }) => (
  <div className={`relative group flex-shrink-0`}>
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
        isSelected
          ? 'bg-accent text-white'
          : 'bg-secondary text-light hover:bg-gray-700'
      } ${onDelete ? 'pr-8' : ''}`}
    >
      {label}
    </button>
    {onDelete && (
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent folder selection
          if (window.confirm(`Are you sure you want to delete the "${label}" folder? Items inside will be moved to Uncategorized.`)) {
            onDelete();
          }
        }}
        className="absolute top-1/2 right-1 -translate-y-1/2 p-1 rounded-full bg-gray-600 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`Delete ${label} folder`}
      >
        <CloseIcon width={12} height={12} />
      </button>
    )}
  </div>
);

const FolderNavigation: React.FC<FolderNavigationProps> = ({
  folders,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
}) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleCreate = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setShowInput(false);
    }
  };

  return (
    <div className="flex items-center space-x-2 pb-2 overflow-x-auto">
      <FolderButton
        label="All"
        isSelected={selectedFolderId === 'all'}
        onClick={() => onSelectFolder('all')}
      />
      <FolderButton
        label="Uncategorized"
        isSelected={selectedFolderId === 'uncategorized'}
        onClick={() => onSelectFolder('uncategorized')}
      />
      {folders.map(folder => (
        <FolderButton
          key={folder.id}
          label={folder.name}
          isSelected={selectedFolderId === folder.id}
          onClick={() => onSelectFolder(folder.id)}
          onDelete={() => onDeleteFolder(folder.id)}
        />
      ))}
      <div className="flex items-center">
        {showInput ? (
          <div className="flex items-center bg-secondary rounded-full">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="New folder..."
              className="bg-transparent text-sm p-2 w-32 focus:outline-none text-light pl-4"
              onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
            <button onClick={handleCreate} className="p-2 text-accent hover:text-light rounded-full">
                <PlusIcon />
            </button>
            <button onClick={() => setShowInput(false)} className="p-2 text-medium hover:text-light rounded-full mr-1">
                <CloseIcon width={16} height={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-full bg-secondary text-light hover:bg-gray-700 transition-colors"
          >
            <PlusIcon />
            <span className="ml-1">New Folder</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FolderNavigation;