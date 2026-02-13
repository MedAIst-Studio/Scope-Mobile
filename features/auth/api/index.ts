import { apiClient } from '@/lib/api';

import { ForgotPasswordFormData, ResetPasswordFormData } from '../types';
import {
  LoginFormData,
  loginResponseSchema,
  loginSchema,
  OAuthLoginFormData,
  oauthLoginResponseSchema,
  oauthLoginSchema,
  SignupFormData,
} from '../utils/validation';
import { refreshAuthToken } from './refresh';

const AUTH_PATH = '/auth';
const USERS_PATH = '/users';

export const AuthAPI = {
  async login(request: LoginFormData) {
    const { data, error, success } = await apiClient.post(`${AUTH_PATH}/login`, request, {
      request: loginSchema,
      response: loginResponseSchema,
    });

    return { data, error, success };
  },

  async signup(request: SignupFormData) {
    const { data, error, success } = await apiClient.post(`${AUTH_PATH}/signup`, {
      username: request.username,
      email: request.email,
      password: request.password,
    });

    return { data, error, success };
  },

  async forgotPassword(data: ForgotPasswordFormData) {
    const { error, success } = await apiClient.post(`${USERS_PATH}/forgot-password`, data);

    return { error, success };
  },

  async resetPassword(data: ResetPasswordFormData, token: string | null) {
    const { error, success } = await apiClient.post(`${USERS_PATH}/reset-password`, {
      data,
      token,
    });

    return { error, success };
  },

  async verifyEmail(code: string) {
    const { error, success } = await apiClient.post(`${USERS_PATH}/verify-email`, { code });

    return { error, success };
  },

  async logout() {
    const { error, success } = await apiClient.post(`${AUTH_PATH}/logout`);

    return { error, success };
  },

  async refreshToken(refreshToken: string) {
    return await refreshAuthToken(refreshToken);
  },

  async oauthLogin(request: OAuthLoginFormData) {
    const { data, error, success } = await apiClient.post(`/api/auth/oauth/mobile`, request, {
      request: oauthLoginSchema,
      response: oauthLoginResponseSchema,
    });

    return { data, error, success };
  },
};
