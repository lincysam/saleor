export const AUTH_LOGIN_REQUEST = 'AUTH_LOGIN_REQUEST';
export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS';
export const AUTH_LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE';

export const AUTH_SIGNUP_REQUEST = 'AUTH_SIGNUP_REQUEST';
export const AUTH_SIGNUP_SUCCESS = 'AUTH_SIGNUP_SUCCESS';
export const AUTH_SIGNUP_FAILURE = 'AUTH_SIGNUP_FAILURE';

export const AUTH_LOGOUT = 'AUTH_LOGOUT';

export const AUTH_PASSWORD_RESET_REQUEST = 'AUTH_PASSWORD_RESET_REQUEST';
export const AUTH_PASSWORD_RESET_SUCCESS = 'AUTH_PASSWORD_RESET_SUCCESS';
export const AUTH_PASSWORD_RESET_FAILURE = 'AUTH_PASSWORD_RESET_FAILURE';

export const AUTH_CONFIRM_ACCOUNT_REQUEST = 'AUTH_CONFIRM_ACCOUNT_REQUEST';
export const AUTH_CONFIRM_ACCOUNT_SUCCESS = 'AUTH_CONFIRM_ACCOUNT_SUCCESS';
export const AUTH_CONFIRM_ACCOUNT_FAILURE = 'AUTH_CONFIRM_ACCOUNT_FAILURE';

export const AUTH_SET_PASSWORD_REQUEST = 'AUTH_SET_PASSWORD_REQUEST';
export const AUTH_SET_PASSWORD_SUCCESS = 'AUTH_SET_PASSWORD_SUCCESS';
export const AUTH_SET_PASSWORD_FAILURE = 'AUTH_SET_PASSWORD_FAILURE';

export const AUTH_CHANGE_PASSWORD_REQUEST = 'AUTH_CHANGE_PASSWORD_REQUEST';
export const AUTH_CHANGE_PASSWORD_SUCCESS = 'AUTH_CHANGE_PASSWORD_SUCCESS';
export const AUTH_CHANGE_PASSWORD_FAILURE = 'AUTH_CHANGE_PASSWORD_FAILURE';

export const AUTH_VERIFY_TOKEN_REQUEST = 'AUTH_VERIFY_TOKEN_REQUEST';
export const AUTH_VERIFY_TOKEN_SUCCESS = 'AUTH_VERIFY_TOKEN_SUCCESS';
export const AUTH_VERIFY_TOKEN_FAILURE = 'AUTH_VERIFY_TOKEN_FAILURE';

export const AUTH_CLEAR_ERROR = 'AUTH_CLEAR_ERROR';

export interface User {
  id: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isStaff?: boolean;
  isActive?: boolean;
  mobile?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  csrfToken: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  requiresConfirmation: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload extends LoginPayload {
  name: string;
  mobile: string;
}

export interface ConfirmAccountPayload {
  email: string;
  token: string;
}

export interface SetPasswordPayload {
  email: string;
  token: string;
  password: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}