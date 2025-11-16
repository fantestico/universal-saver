import React, { useState, useEffect } from 'react';
import { SavedItem } from '../types';

interface SaveFormProps {
  onSave: (item: Omit<SavedItem, 'id' | 'createdAt'>) => void;
  initialUrl?: string;
  selectedFolderId: string;
}

const SaveForm: React.FC<SaveFormProps> = ({ onSave, initialUrl, selectedFolderId }) => {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl);
    }
  }, [initialUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a valid URL.');
      return;
    }
    setError('');

    try {
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      const newItem = {
        url,
        thumbnailUrl: `https://picsum.photos/seed/${encodeURIComponent(url)}/400/200`,
        tags: tagArray.length > 0 ? tagArray : ['Uncategorized'],
        description: description,
        folderId: (selectedFolderId !== 'all' && selectedFolderId !== 'uncategorized') ? selectedFolderId : 'uncategorized',
      };
      onSave(newItem);
      setUrl('');
      setDescription('');
      setTags('');
    } catch (err) {
      console.error(err);
      setError('Failed to save link. Please try again.');
    }
  };

  return (
    <div className="bg-secondary p-4 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste or share any link here..."
          className="w-full bg-primary border border-gray-700 text-light p-3 rounded-md focus:ring-2 focus:ring-accent focus:outline-none transition"
        />
         <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description..."
          rows={3}
          className="w-full bg-primary border border-gray-700 text-light p-3 rounded-md focus:ring-2 focus:ring-accent focus:outline-none transition"
        />
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma-separated)..."
          className="w-full bg-primary border border-gray-700 text-light p-3 rounded-md focus:ring-2 focus:ring-accent focus:outline-none transition"
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        <button
          type="submit"
          className="w-full mt-3 bg-accent text-white font-bold py-3 px-4 rounded-md hover:bg-blue-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
        >
          Save Link
        </button>
      </form>
    </div>
  );
};

export default SaveForm;