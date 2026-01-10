import PropTypes from 'prop-types';
import { useEffect, useReducer, useCallback, useMemo } from 'react';
// utils
import axios, { endpoints } from 'src/utils/axios';
//
import { AuthContext } from './auth-context';
import { isValidToken, setSession } from './utils';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        // const response = await axios.get(endpoints.auth.me);

        const response = {
          data: {
            accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUxNDM0NmE0LWQ5YjgtNDgwNC1iM2U2LWQwOTEyZTA3NjczZCIsImVtYWlsIjoiY29tcGFueUBnbWFpbC5jb20iLCJwaG9uZSI6Ijg3ODgwMDIwMzMiLCJyb2xlcyI6WyJjb21wYW55Il0sInBlcm1pc3Npb25zIjpbXSwiaWF0IjoxNzY2NzUwMzgxLCJleHAiOjE3NjY3NzU1ODF9.9A5ltgpGLKXXbZ3K-92w2h7x0fIEZ1mTXQd_OdW9RZg",
            user: {
              fullName: 'Admin Amplio',
              email: 'admin@gmail.com',
              phone: '4444444444'
            }
          }
        }

        const { user } = response.data;

        dispatch({
          type: 'INITIAL',
          payload: {
            user,
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const sendOtp = useCallback(async (emailOrPhone, rememberMe = false) => {
    await axios.post(endpoints.auth.loginSendOtp, {
      emailOrPhone,
      rememberMe,
    });
  }, []);

  const verifyOtp = useCallback(async (emailOrPhone, otp, rememberMe = false) => {
    const response = await axios.post(endpoints.auth.loginVerifyOtp, {
      emailOrPhone,
      otp,
      rememberMe,
    });

    const { accessToken, user } = response.data;

    sessionStorage.setItem(STORAGE_KEY, accessToken);
    setSession(accessToken);

    dispatch({
      type: 'LOGIN',
      payload:{user},
    });
  },[]);

  // LOGIN
  const login = useCallback(async (emailOrMobile,
    //  password
  ) => {
    const data = {
      emailOrMobile,
      // password,
    };


    // const response = await axios.post(endpoints.auth.login, data);

    const response = {
      data: {
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMzYzBmMjc4LWFkNWUtNDVlMS1hMzliLWU3NDliMzgxYjIzZiIsImVtYWlsIjoia2FyYW5yYWtoMTlAZ21haWwuY29tIiwicGhvbmUiOiI4ODg4NjQ0Mzc4Iiwicm9sZXMiOlsic3VwZXJfYWRtaW4iXSwicGVybWlzc2lvbnMiOltdLCJpYXQiOjE3Njc3NzkyMjcsImV4cCI6MTc2NzgwNDQyN30.Mv9PiIyxGnKySJGWb7OqQah_vVEx1p1ri78ATRs2cww",
        user: {
          fullName: 'Admin Amplio',
          email: 'admin@gmail.com',
          emailOrMobile: '4444444444' || 'admin@gmail.com',
        }
      }
    }

    const { accessToken, user } = response.data;

    setSession(accessToken);

    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const data = {
      email,
      password,
      firstName,
      lastName,
    };

    const response = await axios.post(endpoints.auth.register, data);

    const { accessToken, user } = response.data;

    sessionStorage.setItem(STORAGE_KEY, accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    localStorage.removeItem('demat_popup_shown');
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
      sendOtp,
      verifyOtp,
    }),
    [login, logout, register, state.user, status, sendOtp, verifyOtp]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
