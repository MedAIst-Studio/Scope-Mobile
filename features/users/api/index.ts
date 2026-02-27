import { apiClient } from "@/lib/api";
import { usageResponseSchema, userPreferencesRequest, UserPreferencesRequest, userProfileResponse } from "../validations";

export const userAPI = {
  getUserDetails: async () => {
    const { data, error } = await apiClient.get(`/users/profile`, {}, userProfileResponse);

    return { data, error };
  },

  updateUserDetails: async (username: string) => {
    const { error } = await apiClient.patch(`/users/account`, { username });

    return { error };
  },

  updatePreferences: async (preferences: UserPreferencesRequest) => {
    const { error } = await apiClient.patch(`/users/preferences`, preferences, {
      request: userPreferencesRequest,
    });

    return { error };
  },

  updatePassword: async (old_password: string, new_password: string) => {
    const { error } = await apiClient.patch(`/users/password`, {
      old_password,
      new_password,
    });

    return { error };
  },

  deleteAccount: async () => {
    const { error } = await apiClient.delete(`/users/account`);

    return { error };
  },

  getUsage: async () => {
    const { data, error } = await apiClient.get(`/users/usage`, {}, usageResponseSchema);

    return { data, error };
  },
};
