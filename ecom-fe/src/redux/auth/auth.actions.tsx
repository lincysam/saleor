import * as types from './auth.types';

export const loginRequest = (payload: types.LoginPayload) => ({
  type: types.AUTH_LOGIN_REQUEST,
  payload,
});

export const loginSuccess = (user: types.User, token: string) => ({
  type: types.AUTH_LOGIN_SUCCESS,
  payload: { user, token },
});

export const loginFailure = (error: string) => ({
  type: types.AUTH_LOGIN_FAILURE,
  payload: error,
});

export const signupRequest = (payload: types.SignupPayload) => ({
  type: types.AUTH_SIGNUP_REQUEST,
  payload,
});

export const signupSuccess = (user: types.User, token: string) => ({
  type: types.AUTH_SIGNUP_SUCCESS,
  payload: { user, token },
});

export const signupFailure = (error: string) => ({
  type: types.AUTH_SIGNUP_FAILURE,
  payload: error,
});

export const logout = () => ({
  type: types.AUTH_LOGOUT,
});

export const passwordResetRequest = (email: string) => ({
  type: types.AUTH_PASSWORD_RESET_REQUEST,
  payload: email,
});

export const passwordResetSuccess = () => ({
  type: types.AUTH_PASSWORD_RESET_SUCCESS,
});

export const passwordResetFailure = (error: string) => ({
  type: types.AUTH_PASSWORD_RESET_FAILURE,
  payload: error,
});

export const confirmAccountRequest = (payload: types.ConfirmAccountPayload) => ({
  type: types.AUTH_CONFIRM_ACCOUNT_REQUEST,
  payload,
});

export const confirmAccountSuccess = () => ({
  type: types.AUTH_CONFIRM_ACCOUNT_SUCCESS,
});

export const confirmAccountFailure = (error: string) => ({
  type: types.AUTH_CONFIRM_ACCOUNT_FAILURE,
  payload: error,
});

export const setPasswordRequest = (payload: types.SetPasswordPayload) => ({
  type: types.AUTH_SET_PASSWORD_REQUEST,
  payload,
});

export const setPasswordSuccess = () => ({
  type: types.AUTH_SET_PASSWORD_SUCCESS,
});

export const setPasswordFailure = (error: string) => ({
  type: types.AUTH_SET_PASSWORD_FAILURE,
  payload: error,
});

export const changePasswordRequest = (payload: types.ChangePasswordPayload) => ({
  type: types.AUTH_CHANGE_PASSWORD_REQUEST,
  payload,
});

export const changePasswordSuccess = () => ({
  type: types.AUTH_CHANGE_PASSWORD_SUCCESS,
});

export const changePasswordFailure = (error: string) => ({
  type: types.AUTH_CHANGE_PASSWORD_FAILURE,
  payload: error,
});

export const verifyTokenRequest = () => ({
  type: types.AUTH_VERIFY_TOKEN_REQUEST,
});

export const verifyTokenSuccess = (user: types.User) => ({
  type: types.AUTH_VERIFY_TOKEN_SUCCESS,
  payload: user,
});

export const verifyTokenFailure = () => ({
  type: types.AUTH_VERIFY_TOKEN_FAILURE,
});

export const clearAuthError = () => ({
  type: types.AUTH_CLEAR_ERROR,
});