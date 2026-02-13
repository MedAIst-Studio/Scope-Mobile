import type {Chat, Message} from "../validations";

export interface ChatState {
  messages: Message[];
  inputMessage: string;
  isLoading: boolean;
  savedChats: Chat[];
  currentChatId: string | null;
  isHistoryOpen: boolean;
}

export interface ChatActions {
  setMessages: (messages: Message[]) => void;
  setInputMessage: (message: string) => void;
  setIsLoading: (loading: boolean) => void;
  setSavedChats: (chats: Chat[] | ((prev: Chat[]) => Chat[])) => void;
  setCurrentChatId: (id: string | null) => void;
  setIsHistoryOpen: (open: boolean) => void;
}
