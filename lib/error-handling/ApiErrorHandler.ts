import { AxiosError } from 'axios';
import { errorEventBus } from './ErrorEventBus';

interface ApiErrorResponse {
  message?: string;
  errors?: string[];
  [key: string]: any;
}

export class ApiErrorHandler {
  static handle(error: AxiosError<ApiErrorResponse>) {
    if (!error.response) {
      errorEventBus.emit('SHOW_TOAST', {
        title: 'Bağlantı Hatası',
        message: 'Sunucuya ulaşılamıyor. Lütfen internet bağlantınızı kontrol edin.',
        type: 'warning',
        duration: 5000,
      });
      return;
    }

    const status = error.response.status;
    const data = error.response.data;
    const errorMessage = data?.message || data?.errors?.[0] || 'Beklenmedik bir hata oluştu.';

    if (status === 401) {
      if (
        error.config?.url?.includes('/auth/login') ||
        error.config?.url?.includes('/auth/signup')
      ) {
        return;
      }

      errorEventBus.emit('REDIRECT_LOGIN');
      errorEventBus.emit('SHOW_TOAST', {
        title: 'Oturum Süresi Doldu',
        message: 'Lütfen tekrar giriş yapın.',
        type: 'error',
      });
      return;
    }

    if (status === 403) {
      errorEventBus.emit('SHOW_TOAST', {
        title: 'Erişim Engellendi',
        message: 'Bu işlemi yapmaya yetkiniz yok.',
        type: 'error',
      });
      return;
    }

    if (status >= 500) {
      errorEventBus.emit('SHOW_TOAST', {
        title: 'Sunucu Hatası',
        message: 'Bizden kaynaklı bir sorun oluştu. Lütfen daha sonra tekrar deneyin.',
        type: 'error',
      });
      return;
    }

    if (status === 400 || status === 422) {
      errorEventBus.emit('SHOW_TOAST', {
        title: 'Hata',
        message: errorMessage,
        type: 'error',
      });
      return;
    }

    errorEventBus.emit('SHOW_TOAST', {
      title: 'Hata',
      message: errorMessage,
      type: 'error',
    });
  }
}
