export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export interface QuickQuestion {
  id: string;
  text: string;
}
