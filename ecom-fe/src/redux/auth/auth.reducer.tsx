import * as types from './auth.types';

const getInitialState = (): types.AuthState => {
  const token = localStorage.getItem('auth_token');
  const refreshToken = localStorage.getItem('refresh_token');
  const csrfToken = localStorage.getItem('csrf_token');
  const userStr = localStorage.getItem('auth_user'); // Get user from localStorage
  
  return {
    user: userStr ? JSON.parse(userStr) : null, // Parse user from localStorage
    token,
    refreshToken,
    csrfToken,
    loading: false,
    error: null,
    isAuthenticated: !!token,
    requiresConfirmation: false,
  };
};

const authReducer = (state = getInitialState(), action: any): types.AuthState => {
  switch (action.type) {
    case types.AUTH_LOGIN_REQUEST:
    case types.AUTH_SIGNUP_REQUEST:
    case types.AUTH_PASSWORD_RESET_REQUEST:
    case types.AUTH_CONFIRM_ACCOUNT_REQUEST:
    case types.AUTH_SET_PASSWORD_REQUEST:
    case types.AUTH_CHANGE_PASSWORD_REQUEST:
    case types.AUTH_VERIFY_TOKEN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.AUTH_LOGIN_SUCCESS:
      // Store user in localStorage
      localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        isAuthenticated: true,
        requiresConfirmation: false,
        error: null,
      };

    case types.AUTH_SIGNUP_SUCCESS:
      const hasToken = !!action.payload.token;
      // Store user in localStorage only if we have a token (immediate login)
      if (hasToken && action.payload.user) {
        localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
      }
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        isAuthenticated: hasToken,
        requiresConfirmation: !hasToken,
        error: null,
      };

    case types.AUTH_VERIFY_TOKEN_SUCCESS:
      // Store user in localStorage
      localStorage.setItem('auth_user', JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
        loading: false,
        isAuthenticated: true,
        error: null,
      };

    case types.AUTH_LOGIN_FAILURE:
    case types.AUTH_SIGNUP_FAILURE:
    case types.AUTH_PASSWORD_RESET_FAILURE:
    case types.AUTH_CONFIRM_ACCOUNT_FAILURE:
    case types.AUTH_SET_PASSWORD_FAILURE:
    case types.AUTH_CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        requiresConfirmation: false,
      };

    case types.AUTH_VERIFY_TOKEN_FAILURE:
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('csrf_token');
      localStorage.removeItem('auth_user'); // Remove user from localStorage
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        csrfToken: null,
        loading: false,
        isAuthenticated: false,
        error: null,
      };

    case types.AUTH_PASSWORD_RESET_SUCCESS:
    case types.AUTH_CONFIRM_ACCOUNT_SUCCESS:
    case types.AUTH_SET_PASSWORD_SUCCESS:
    case types.AUTH_CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };

    case types.AUTH_LOGOUT:
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('csrf_token');
      localStorage.removeItem('auth_user'); // Remove user from localStorage
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        csrfToken: null,
        isAuthenticated: false,
        requiresConfirmation: false,
        loading: false,
        error: null,
      };

    case types.AUTH_CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

export default authReducer;