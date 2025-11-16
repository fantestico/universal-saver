export interface SavedItem {
  id: string;
  url: string;
  thumbnailUrl: string;
  tags: string[];
  description: string;
  createdAt: string;
  folderId: string;
}

export interface Folder {
  id: string;
  name: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}
