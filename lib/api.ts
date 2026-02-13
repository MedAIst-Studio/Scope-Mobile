import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import { z } from 'zod';

import { AuthAPI } from '@/features/auth/api';

import { ApiErrorHandler } from './error-handling/ApiErrorHandler';
import { logger } from './logger';
import { ApiConfig, ApiError, ApiRequestConfig } from './types';
import { createApiError } from './utils';
import { validateApiResponse, ValidationError } from './validation';

export interface ApiResponse<T = any> {
  data: T | null;
  error: ApiError | null;
  success: boolean;
}

const defaultApiConfig: ApiConfig = {
  enableValidation: true,
  enableLogging: process.env.NODE_ENV !== 'production',
  timeout: 10000,
};

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: defaultApiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

import * as SecureStore from 'expo-secure-store';

axiosInstance.interceptors.request.use(
  async (config: any) => {
    config.requestId = logger.generateRequestId();
    config.startTime = Date.now();

    const accessToken = await SecureStore.getItemAsync('accessToken');

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (defaultApiConfig.enableLogging) {
      logger.logApiRequest({
        id: config.requestId,
        method: (config.method?.toUpperCase() as any) || 'GET',
        url: `${config.baseURL}${config.url}`,
        headers: config.headers as Record<string, string>,
        data: config.data,
        timestamp: new Date(),
      });
    }

    return config;
  },
  (error: any) => {
    logger.error('Request interceptor error', error);

    return Promise.reject(createApiError(error, 'REQUEST_INTERCEPTOR_ERROR'));
  }
);

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as any;
    const duration = config.startTime ? Date.now() - config.startTime : 0;

    if (defaultApiConfig.enableLogging) {
      logger.logApiResponse({
        requestId: config.requestId,
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        duration,
        timestamp: new Date(),
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    const duration = originalRequest?.startTime ? Date.now() - originalRequest.startTime : 0;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/refresh')) {
        logger.error('Refresh token failed, logging out');

        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');

        return Promise.reject(createApiError(error, 'AUTH_REFRESH_FAILED'));
      }

      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        const { data, error: refreshError } = await AuthAPI.refreshToken(refreshToken || '');

        if (data?.access_token) {
          await SecureStore.setItemAsync('accessToken', data.access_token);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
          }

          onTokenRefreshed(data.access_token);

          isRefreshing = false;

          return axiosInstance(originalRequest);
        }

        isRefreshing = false;
        refreshSubscribers = [];

        logger.error('Token refresh failed', refreshError);

        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');

        return Promise.reject(createApiError(refreshError, 'TOKEN_REFRESH_ERROR'));
      }

      return new Promise((resolve) => {
        subscribeTokenRefresh((token: string) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }

          resolve(axiosInstance(originalRequest));
        });
      });
    }

    if (defaultApiConfig.enableLogging) {
      logger.logApiResponse({
        requestId: originalRequest?.requestId,
        status: error.response?.status || 0,
        statusText: error.response?.statusText || 'Network Error',
        data: error.response?.data,
        duration,
        timestamp: new Date(),
        errors: [error.message],
      });
    }

    const apiError = createApiError(error, 'API_RESPONSE_ERROR');

    logger.error('API Error', apiError);
    ApiErrorHandler.handle(error as any);

    return Promise.reject(apiError);
  }
);

class ApiClient {
  private instance: AxiosInstance;
  private config: ApiConfig;

  constructor(instance: AxiosInstance, config: ApiConfig) {
    this.instance = instance;
    this.config = config;
  }

  async request<TResponse = any, TRequest = any>(
    requestConfig: ApiRequestConfig<TRequest, TResponse>
  ): Promise<ApiResponse<TResponse>> {
    const {
      url,
      method,
      data,
      params,
      headers,
      validationSchema,
      responseSchema,
      skipValidation = false,
      timeout,
      responseType,
    } = requestConfig;

    // Request validation
    if (this.config.enableValidation && !skipValidation && validationSchema && data) {
      const validation = validationSchema.safeParse(data);

      if (!validation.success) {
        const errors = validation.error.issues.map(
          (err: any) => `${err.path.join('.')}: ${err.message}`
        );

        const validationError = new ValidationError('Request validation failed', errors, {
          url,
          method,
        });

        return {
          data: null,
          error: createApiError(validationError, 'VALIDATION_ERROR'),
          success: false,
        };
      }
    }

    try {
      const axiosConfig: AxiosRequestConfig = {
        url,
        method: method.toLowerCase() as any,
        data,
        params,
        headers,
        ...(timeout && { timeout }),
        ...(responseType && { responseType }),
      };

      const response = await this.instance.request(axiosConfig);

      if (this.config.enableValidation && !skipValidation && responseSchema) {
        const validation = validateApiResponse(responseSchema, response.data, {
          endpoint: url,
          method,
        });

        if (!validation.isValid) {
          const validationError = new ValidationError(
            'Response validation failed',
            validation.errors,
            {
              url,
              method,
              response: response.data,
            }
          );

          return {
            data: null,
            error: createApiError(validationError, 'RESPONSE_VALIDATION_ERROR'),
            success: false,
          };
        }

        return {
          data: validation.data as TResponse,
          error: null,
          success: true,
        };
      }

      return {
        data: response.data,
        error: null,
        success: true,
      };
    } catch (error) {
      const apiError =
        error instanceof ValidationError
          ? createApiError(error, 'VALIDATION_ERROR')
          : createApiError(error, 'API_CLIENT_ERROR');

      return {
        data: null,
        error: apiError,
        success: false,
      };
    }
  }

  // Convenience methods with type inference
  async get<TSchema extends z.ZodTypeAny>(
    url: string,
    params?: object,
    responseSchema?: TSchema
  ): Promise<ApiResponse<TSchema extends z.ZodTypeAny ? z.infer<TSchema> : any>> {
    return this.request<TSchema extends z.ZodTypeAny ? z.infer<TSchema> : any, any>({
      url,
      method: 'GET',
      params,
      responseSchema: responseSchema as any,
    });
  }

  async post<TRequestSchema extends z.ZodTypeAny, TResponseSchema extends z.ZodTypeAny>(
    url: string,
    data?: TRequestSchema extends z.ZodTypeAny ? z.infer<TRequestSchema> : any,
    schemas?: {
      request?: TRequestSchema;
      response?: TResponseSchema;
    }
  ): Promise<ApiResponse<TResponseSchema extends z.ZodTypeAny ? z.infer<TResponseSchema> : any>> {
    return this.request<TResponseSchema extends z.ZodTypeAny ? z.infer<TResponseSchema> : any, any>(
      {
        url,
        method: 'POST',
        data,
        validationSchema: schemas?.request as any,
        responseSchema: schemas?.response as any,
      }
    );
  }

  async put<TRequestSchema extends z.ZodTypeAny, TResponseSchema extends z.ZodTypeAny>(
    url: string,
    data?: TRequestSchema extends z.ZodTypeAny ? z.infer<TRequestSchema> : any,
    schemas?: {
      request?: TRequestSchema;
      response?: TResponseSchema;
    }
  ): Promise<ApiResponse<TResponseSchema extends z.ZodTypeAny ? z.infer<TResponseSchema> : any>> {
    return this.request<TResponseSchema extends z.ZodTypeAny ? z.infer<TResponseSchema> : any, any>(
      {
        url,
        method: 'PUT',
        data,
        validationSchema: schemas?.request as any,
        responseSchema: schemas?.response as any,
      }
    );
  }

  async patch<TRequestSchema extends z.ZodTypeAny, TResponseSchema extends z.ZodTypeAny>(
    url: string,
    data?: TRequestSchema extends z.ZodTypeAny ? z.infer<TRequestSchema> : any,
    schemas?: {
      request?: TRequestSchema;
      response?: TResponseSchema;
    }
  ): Promise<ApiResponse<TResponseSchema extends z.ZodTypeAny ? z.infer<TResponseSchema> : any>> {
    return this.request<TResponseSchema extends z.ZodTypeAny ? z.infer<TResponseSchema> : any, any>(
      {
        url,
        method: 'PATCH',
        data,
        validationSchema: schemas?.request as any,
        responseSchema: schemas?.response as any,
      }
    );
  }

  async delete<TSchema extends z.ZodTypeAny>(
    url: string,
    responseSchema?: TSchema
  ): Promise<ApiResponse<TSchema extends z.ZodTypeAny ? z.infer<TSchema> : any>> {
    return this.request<TSchema extends z.ZodTypeAny ? z.infer<TSchema> : any, any>({
      url,
      method: 'DELETE',
      responseSchema: responseSchema as any,
    });
  }
}

export const apiClient = new ApiClient(axiosInstance, defaultApiConfig);
