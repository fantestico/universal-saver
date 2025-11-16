import React, { useState, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // We'll need a way to generate unique IDs
import { SavedItem, Folder } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import SaveForm from './components/SaveForm';
import ItemList from './components/ItemList';
import SearchBar from './components/SearchBar';
import Chatbot from './components/Chatbot';
import { ChatIcon } from './components/icons';
import FolderNavigation from './components/FolderNavigation';

// Helper to generate a unique ID
const generateId = () => uuidv4();

const App: React.FC = () => {
  const [savedItems, setSavedItems] = useLocalStorage<SavedItem[]>('savedItems', []);
  const [folders, setFolders] = useLocalStorage<Folder[]>('folders', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isChatOpen, setChatOpen] = useState(false);
  const [initialUrl, setInitialUrl] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState('all');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedUrl = params.get('sharedUrl');
    if (sharedUrl) {
      setInitialUrl(sharedUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSaveItem = (item: Omit<SavedItem, 'id' | 'createdAt'>) => {
    const newItem: SavedItem = {
      ...item,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setSavedItems(prevItems => [newItem, ...prevItems]);
  };

  const handleDeleteItem = (id: string) => {
    setSavedItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleCreateFolder = (name: string) => {
    if (name && !folders.some(f => f.name === name)) {
      const newFolder: Folder = { id: generateId(), name };
      setFolders(prevFolders => [...prevFolders, newFolder]);
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    // Move items from the deleted folder to 'uncategorized'
    setSavedItems(prevItems =>
      prevItems.map(item =>
        item.folderId === folderId ? { ...item, folderId: 'uncategorized' } : item
      )
    );
    // Remove the folder itself
    setFolders(prevFolders => prevFolders.filter(folder => folder.id !== folderId));
    
    if (selectedFolderId === folderId) {
      setSelectedFolderId('all');
    }
  };

  const handleMoveItemToFolder = (itemId: string, folderId: string) => {
    setSavedItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, folderId: folderId } : item
      )
    );
  };

  const filteredItems = useMemo(() => {
    const folderFiltered = savedItems.filter(item => {
      if (selectedFolderId === 'all') return true;
      if (selectedFolderId === 'uncategorized') return item.folderId === 'uncategorized' || !item.folderId;
      return item.folderId === selectedFolderId;
    });

    if (!searchTerm) {
      return folderFiltered;
    }

    return folderFiltered.filter(item =>
      item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }, [savedItems, searchTerm, selectedFolderId]);

  useEffect(() => {
    // Install uuid for id generation if not present
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuid.min.js';
    script.onload = () => {
      console.log('uuid loaded');
    };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isChatOpen]);

  return (
    <div className="min-h-screen bg-primary font-sans">
      <Header />
      <main className="container mx-auto p-4 max-w-2xl pb-24">
        <SaveForm onSave={handleSaveItem} initialUrl={initialUrl} selectedFolderId={selectedFolderId} />
        <div className="my-6 space-y-4">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <FolderNavigation
            folders={folders}
            selectedFolderId={selectedFolderId}
            onSelectFolder={setSelectedFolderId}
            onCreateFolder={handleCreateFolder}
            onDeleteFolder={handleDeleteFolder}
          />
        </div>
        <ItemList
          items={filteredItems}
          onDelete={handleDeleteItem}
          folders={folders}
          onMoveItemToFolder={handleMoveItemToFolder}
        />
      </main>
      
      <button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 bg-accent text-white p-4 rounded-full shadow-lg hover:bg-blue-500 transition-colors duration-300 z-50"
        aria-label="Open AI Chat"
      >
        <ChatIcon />
      </button>

      {isChatOpen && <Chatbot onClose={() => setChatOpen(false)} />}
    </div>
  );
};

// A simple polyfill for uuidv4 if the script hasn't loaded yet.
const uuidv4 = () => {
  if (window.uuid) {
    return window.uuid.v4();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

declare global {
  interface Window {
    uuid: {
      v4: () => string;
    };
  }
}

export default App;
