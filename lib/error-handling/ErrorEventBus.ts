type ErrorEventType = 'SHOW_TOAST' | 'SHOW_ALERT' | 'REDIRECT_LOGIN';

export interface ToastPayload {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  duration?: number;
}

export interface AlertPayload {
  title: string;
  message: string;
  buttons?: { text: string; onPress?: () => void; style?: 'default' | 'cancel' | 'destructive' }[];
}

type EventPayload = ToastPayload | AlertPayload | undefined;

type Listener = (payload?: any) => void;

class ErrorEventBus {
  private listeners: Map<ErrorEventType, Listener[]> = new Map();

  subscribe(event: ErrorEventType, callback: Listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);

    return () => {
      const listeners = this.listeners.get(event);
      if (listeners) {
        this.listeners.set(
          event,
          listeners.filter((cb) => cb !== callback)
        );
      }
    };
  }

  emit(event: ErrorEventType, payload?: EventPayload) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => callback(payload));
    }
  }
}

export const errorEventBus = new ErrorEventBus();
