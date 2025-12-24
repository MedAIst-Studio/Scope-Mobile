import {apiClient} from "@/lib/api";

export const userAPI = {
  getUserDetails: async () => {
    const {data, error} = await apiClient.get(`/users/profile`);

    return {data, error};
  },

  updateUserDetails: async (username: string) => {
    const {error} = await apiClient.patch(`/users/account`, {username});

    return {error};
  },

  updatePassword: async (old_password: string, new_password: string) => {
    const {error} = await apiClient.patch(`/users/password`, {
      old_password,
      new_password,
    });

    return {error};
  },

  deleteAccount: async () => {
    const {error} = await apiClient.delete(`/users/account`);

    return {error};
  },
};
