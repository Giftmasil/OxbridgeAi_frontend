import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

const initialState = {
    isAuthenticated: false,
    loading: false,
    user: null,
    error: null,
    token: null,
    role: null,
    userId: null,
};

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

export const signup = createAsyncThunk(
    'auth/signup',
    async (userData, { rejectWithValue }) => {
      try {
        await axiosInstance.post('/api/v1/admin/signup', userData);
        return true; // Just return success, no data needed
      } catch (error) {
        console.error('Signup error:', error);
        return rejectWithValue(error.response?.data?.message || 'Signup failed');
      }
    }
  );

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const isAdmin = credentials.email.includes("admin");
      const loginUrl = isAdmin 
        ? "api/v1/admin/login"
        : "api/v1/judge/login";

      const response = await axiosInstance.post(loginUrl, credentials);
      
      const { token: tokenData } = response.data;
      const { token, judge } = tokenData;
      const role = isAdmin ? "admin" : "judge";

      setAuthToken(token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', judge._id);

      return {
        token,
        user: judge,
        role,
        userId: judge._id
      };
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const checkAuthState = createAsyncThunk(
  'auth/checkState',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const userId = localStorage.getItem('userId');

      if (!token || !role || !userId) {
        return rejectWithValue('No auth data found');
      }

      setAuthToken(token);

      // Fetch user data if it's a judge
      let userData = null;
      if (role === 'judge') {
        const response = await axiosInstance.get(`/api/v1/judges/${userId}`);
        userData = response.data;
      }

      return {
        token,
        role,
        userId,
        user: userData || { _id: userId },
        isAuthenticated: true
      };
    } catch (error) {
      console.error('Check auth state error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      return rejectWithValue('Session expired');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    setAuthToken(null);
    localStorage.clear()
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Signup cases
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Don't modify auth state on signup success
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.user = action.payload.user;
        state.userId = action.payload.userId;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.token = null;
        state.role = null;
        state.user = null;
        state.userId = null;
      })
      .addCase(logout.fulfilled, () => initialState)
      .addCase(checkAuthState.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.user = action.payload.user;
        state.userId = action.payload.userId;
        state.error = null;
      })
      // eslint-disable-next-line no-unused-vars
      .addCase(checkAuthState.rejected, (state) => {
        return {
          ...initialState,
          loading: false
        };
      });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;