// src/components/AuthInitializer.tsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { verifyTokenRequest } from '@/redux/auth/auth.actions';

const AuthInitializer = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check if user has token in localStorage but not authenticated in Redux
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    
    // If token exists but user is not authenticated, verify the token
    if (token && user && !isAuthenticated && !loading) {
      dispatch(verifyTokenRequest());
    }
  }, [dispatch, isAuthenticated, loading]);

  return null; // This component doesn't render anything
};

export default AuthInitializer;