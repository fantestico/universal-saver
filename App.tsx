import React, { useState, useMemo, useEffect } from 'react';
import { User } from 'firebase/auth';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, writeBatch, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import { SavedItem, Folder } from './types';
import Header from './components/Header';
import SaveForm from './components/SaveForm';
import ItemList from './components/ItemList';
import SearchBar from './components/SearchBar';
import Chatbot from './components/Chatbot';
import { ChatIcon } from './components/icons';
import FolderNavigation from './components/FolderNavigation';
import Login from './components/Login';

const App: React.FC = () => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isChatOpen, setChatOpen] = useState(false);
  const [initialUrl, setInitialUrl] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState('all');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedItems([]);
      setFolders([]);
      return;
    }

    const itemsCollection = collection(db, 'users', user.uid, 'items');
    const foldersCollection = collection(db, 'users', user.uid, 'folders');

    const unsubscribeItems = onSnapshot(itemsCollection, (snapshot) => {
      const itemsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as SavedItem[];
      setSavedItems(itemsData);
    });

    const unsubscribeFolders = onSnapshot(foldersCollection, (snapshot) => {
      const foldersData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Folder[];
      setFolders(foldersData);
    });

    return () => {
      unsubscribeItems();
      unsubscribeFolders();
    };
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedUrl = params.get('sharedUrl');
    if (sharedUrl) {
      setInitialUrl(sharedUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSaveItem = async (item: Omit<SavedItem, 'id' | 'createdAt'>) => {
    if (!user) return;
    const itemsCollection = collection(db, 'users', user.uid, 'items');
    await addDoc(itemsCollection, {...item, createdAt: serverTimestamp() });
  };

  const handleDeleteItem = async (id: string) => {
    if (!user) return;
    const itemDoc = doc(db, 'users', user.uid, 'items', id);
    await deleteDoc(itemDoc);
  };

  const handleCreateFolder = async (name: string) => {
    if (!user) return;
    if (name && !folders.some(f => f.name === name)) {
      const foldersCollection = collection(db, 'users', user.uid, 'folders');
      await addDoc(foldersCollection, { name });
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!user) return;
    
    const batch = writeBatch(db);
    const itemsCollectionRef = collection(db, 'users', user.uid, 'items');
    const q = query(itemsCollectionRef, where("folderId", "==", folderId));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
        batch.update(doc.ref, { folderId: "uncategorized" });
    });

    const folderDocRef = doc(db, 'users', user.uid, 'folders', folderId);
    batch.delete(folderDocRef);

    await batch.commit();

    if (selectedFolderId === folderId) {
      setSelectedFolderId('all');
    }
  };

  const handleMoveItemToFolder = async (itemId: string, folderId: string) => {
    if (!user) return;
    const itemDoc = doc(db, 'users', user.uid, 'items', itemId);
    await updateDoc(itemDoc, { folderId });
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
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [savedItems, searchTerm, selectedFolderId]);

  useEffect(() => {
    if (isChatOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isChatOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <p className="text-light">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-primary font-sans">
      <Header user={user} />
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

export default App;