import { axiosInstance } from '@/lib/api';
import { validateApiResponse } from '@/lib/validation';
import { refreshTokenResponseSchema } from '../utils/validation';

export const refreshAuthToken = async (refreshToken: string) => {
  try {
    const response = await axiosInstance.post('/auth/refresh', {
      refresh_token: refreshToken,
    });

    const validation = validateApiResponse(refreshTokenResponseSchema, response.data, {
      endpoint: '/auth/refresh',
      method: 'POST',
    });

    if (!validation.isValid) {
      return {
        data: null,
        error: { message: 'Refresh token response validation failed' },
        success: false,
      };
    }

    return {
      data: validation.data,
      error: null,
      success: true,
    };
  } catch (error: any) {
    return {
      data: null,
      error: { message: error.message || 'Token refresh failed' },
      success: false,
    };
  }
};
