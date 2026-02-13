export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserDetailsRequest {
  username: string;
}

export interface UpdatePasswordRequest {
  old_password: string;
  new_password: string;
}
