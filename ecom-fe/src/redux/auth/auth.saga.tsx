import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as types from './auth.types';
import * as actions from './auth.actions';
import apolloClient from '@/lib/apolloClient';
import { 
  TOKEN_CREATE, 
  ACCOUNT_REGISTER, 
  PASSWORD_RESET_REQUEST, 
  CONFIRM_ACCOUNT, 
  SET_PASSWORD,
  CHANGE_PASSWORD
} from '@/graphql/auth.mutations';
import { VERIFY_TOKEN } from '@/graphql/auth.queries';

const SALEOR_CHANNEL = import.meta.env.VITE_SALEOR_CHANNEL || 'ind_retail';

function* loginSaga(action: ReturnType<typeof actions.loginRequest>): Generator<any, void, any> {
  try {
    const { email, password } = action.payload;
    
    const { data } = yield call([apolloClient, 'mutate'], {
      mutation: TOKEN_CREATE,
      variables: { email, password },
    });

    if (data.tokenCreate.errors && data.tokenCreate.errors.length > 0) {
      const errorMessage = data.tokenCreate.errors[0].message;
      yield put(actions.loginFailure(errorMessage));
      return;
    }

    const { token, refreshToken, csrfToken, user } = data.tokenCreate;
    
    // Store tokens in localStorage
    localStorage.setItem('auth_token', token);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    if (csrfToken) localStorage.setItem('csrf_token', csrfToken);
    
    // Transform Saleor user to app user format
    const appUser = {
      id: user.id,
      email: user.email,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      isStaff: user.isStaff || false,
    };
    
    yield put(actions.loginSuccess(appUser, token));
   
  
  } catch (error: any) {
    console.error('Login error:', error);
    yield put(actions.loginFailure(
      error.message.includes('Network error') 
        ? 'Unable to connect to server. Please try again.' 
        : error.message || 'Login failed. Please check your credentials.'
    ));
  }
}

function* signupSaga(action: ReturnType<typeof actions.signupRequest>): Generator<any, void, any> {
  try {
    const { email, password, name ,mobile} = action.payload;
    
    // Split name into firstName and lastName
    const nameParts = name?.split(' ') || [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // const redirectUrl = `${window.location.origin}/confirm-account/`;
    const redirectUrl = "http://frontend/confirm-account/";
    
    const { data } = yield call([apolloClient, 'mutate'], {
      mutation: ACCOUNT_REGISTER,
      variables: {
        email,
        password,
        redirectUrl,
        firstName,
        lastName,
        channel: SALEOR_CHANNEL,
        metadata: [
            { key: "mobile", value:  `+91${mobile}` },
            ]
      },
    });

    if (data.accountRegister.errors && data.accountRegister.errors.length > 0) {
      const errorMessage = data.accountRegister.errors[0].message;
      yield put(actions.signupFailure(errorMessage));
      return;
    }

    const userData = {
      id: data.accountRegister.user?.id || '',
      email,
      name,
      firstName,
      lastName,
      isActive: data.accountRegister.user?.isActive || false,
      isStaff: data.accountRegister.user?.isStaff || false,
    };

    // If account requires confirmation, we don't have a token yet
    if (data.accountRegister.requiresConfirmation) {
      yield put(actions.signupSuccess(userData, ''));
      yield put(actions.signupSuccess({ 
        id: '', 
        email, 
        name,
        firstName,
        lastName,
        mobile
      }, ''));
    } else {
      // If no confirmation required, log the user in immediately
      const { data: loginData } = yield call([apolloClient, 'mutate'], {
        mutation: TOKEN_CREATE,
        variables: { email, password },
      });

      if (loginData.tokenCreate.errors && loginData.tokenCreate.errors.length > 0) {
        // Even if login fails, signup was successful
        yield put(actions.signupSuccess(userData, ''));
        yield put(actions.signupSuccess({ 
          id: '', 
          email, 
          name,
          firstName,
          lastName,
          mobile
        }, ''));
        return;
      }

      const { token, refreshToken, csrfToken, user } = loginData.tokenCreate;
      
      localStorage.setItem('auth_token', token);
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
      if (csrfToken) localStorage.setItem('csrf_token', csrfToken);
      
      const appUser = {
        id: user.id,
        email: user.email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        isStaff: user.isStaff || false,
      };
      
      yield put(actions.signupSuccess(appUser, token));
    }
  } catch (error: any) {
    console.error('Signup error:', error);
    yield put(actions.signupFailure(
      error.message.includes('Network error')
        ? 'Unable to connect to server. Please try again.'
        : error.message || 'Signup failed. Please try again.'
    ));
  }
}

function* passwordResetSaga(action: ReturnType<typeof actions.passwordResetRequest>): Generator<any, void, any> {
  try {
    const email = action.payload;
    const redirectUrl = `${window.location.origin}/reset-password/`;
    
    const { data } = yield call([apolloClient, 'mutate'], {
      mutation: PASSWORD_RESET_REQUEST,
      variables: {
        email,
        redirectUrl,
        channel: SALEOR_CHANNEL,
      },
    });

    if (data.requestPasswordReset.errors && data.requestPasswordReset.errors.length > 0) {
      const errorMessage = data.requestPasswordReset.errors[0].message;
      yield put(actions.passwordResetFailure(errorMessage));
      return;
    }

    yield put(actions.passwordResetSuccess());
  } catch (error: any) {
    console.error('Password reset error:', error);
    yield put(actions.passwordResetFailure(
      error.message.includes('Network error')
        ? 'Unable to connect to server. Please try again.'
        : error.message || 'Password reset request failed.'
    ));
  }
}

function* confirmAccountSaga(action: ReturnType<typeof actions.confirmAccountRequest>): Generator<any, void, any> {
  try {
    const { email, token } = action.payload;
    
    const { data } = yield call([apolloClient, 'mutate'], {
      mutation: CONFIRM_ACCOUNT,
      variables: { email, token },
    });

    if (data.confirmAccount.errors && data.confirmAccount.errors.length > 0) {
      const errorMessage = data.confirmAccount.errors[0].message;
      yield put(actions.confirmAccountFailure(errorMessage));
      return;
    }

    yield put(actions.confirmAccountSuccess());
  } catch (error: any) {
    console.error('Confirm account error:', error);
    yield put(actions.confirmAccountFailure(
      error.message.includes('Network error')
        ? 'Unable to connect to server. Please try again.'
        : error.message || 'Account confirmation failed.'
    ));
  }
}

function* setPasswordSaga(action: ReturnType<typeof actions.setPasswordRequest>): Generator<any, void, any> {
  try {
    const { email, token, password } = action.payload;
    
    const { data } = yield call([apolloClient, 'mutate'], {
      mutation: SET_PASSWORD,
      variables: { email, token, password },
    });

    if (data.setPassword.errors && data.setPassword.errors.length > 0) {
      const errorMessage = data.setPassword.errors[0].message;
      yield put(actions.setPasswordFailure(errorMessage));
      return;
    }

    yield put(actions.setPasswordSuccess());
  } catch (error: any) {
    console.error('Set password error:', error);
    yield put(actions.setPasswordFailure(
      error.message.includes('Network error')
        ? 'Unable to connect to server. Please try again.'
        : error.message || 'Password reset failed.'
    ));
  }
}

function* changePasswordSaga(action: ReturnType<typeof actions.changePasswordRequest>): Generator<any, void, any> {
  try {
    const { oldPassword, newPassword } = action.payload;
    
    const { data } = yield call([apolloClient, 'mutate'], {
      mutation: CHANGE_PASSWORD,
      variables: { oldPassword, newPassword },
    });

    if (data.passwordChange.errors && data.passwordChange.errors.length > 0) {
      const errorMessage = data.passwordChange.errors[0].message;
      yield put(actions.changePasswordFailure(errorMessage));
      return;
    }

    yield put(actions.changePasswordSuccess());
  } catch (error: any) {
    console.error('Change password error:', error);
    yield put(actions.changePasswordFailure(
      error.message.includes('Network error')
        ? 'Unable to connect to server. Please try again.'
        : error.message || 'Password change failed.'
    ));
  }
}

function* verifyTokenSaga(): Generator<any, void, any> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      yield put(actions.verifyTokenFailure());
      return;
    }

    const { data } = yield call([apolloClient, 'mutate'], {
      mutation: VERIFY_TOKEN,
      variables: { token },
    });

    if (data.tokenVerify.errors && data.tokenVerify.errors.length > 0) {
      yield put(actions.verifyTokenFailure());
      return;
    }

    const { user } = data.tokenVerify;
    const appUser = {
      id: user.id,
      email: user.email,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isStaff: user.isStaff || false,
      isActive: user.isActive || false,
    };

    yield put(actions.verifyTokenSuccess(appUser));
  } catch (error: any) {
    console.error('Verify token error:', error);
    yield put(actions.verifyTokenFailure());
  }
}

export default function* authSaga() {
  yield takeLatest(types.AUTH_LOGIN_REQUEST, loginSaga);
  yield takeLatest(types.AUTH_SIGNUP_REQUEST, signupSaga);
  yield takeLatest(types.AUTH_PASSWORD_RESET_REQUEST, passwordResetSaga);
  yield takeLatest(types.AUTH_CONFIRM_ACCOUNT_REQUEST, confirmAccountSaga);
  yield takeLatest(types.AUTH_SET_PASSWORD_REQUEST, setPasswordSaga);
  yield takeLatest(types.AUTH_CHANGE_PASSWORD_REQUEST, changePasswordSaga);
  yield takeLatest(types.AUTH_VERIFY_TOKEN_REQUEST, verifyTokenSaga);
}