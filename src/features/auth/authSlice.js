import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Password validation utility
const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[@$!%*?&]/.test(password);

  if (password.length < minLength) {
    return 'Password must be at least 8 characters';
  }
  if (!hasUpperCase || !hasLowerCase) {
    return 'Password must contain uppercase and lowercase letters';
  }
  if (!hasNumber) {
    return 'Password must contain a number';
  }
  if (!hasSpecialChar) {
    return 'Password must contain a special character (@$!%*?&)';
  }
  return null;
};

// Utility for robust error extraction
const extractErrorMessage = (error) => {
  // Handle plain string errors (from api.js service layer)
  if (typeof error === 'string') {
    return error;
  }
  
  // Handle plain Error objects with message
  if (error instanceof Error && error.message) {
    // If it's a status code message, try to make it more user-friendly
    if (error.message.includes('status')) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        return 'Invalid email or password';
      }
      if (error.message.includes('403') || error.message.includes('Forbidden')) {
        return 'Your account is not verified. Please check your email.';
      }
    }
    return error.message;
  }
  
  // Handle network errors without response
  if (!error.response?.data) {
    return error.message || 'An error occurred. Please check your connection.';
  }
  
  const data = error.response.data;
  
  // Handle rate limit errors (429)
  if (error.response.status === 429 || data.code === 'RATE_LIMIT') {
    return data.error || 'Too many attempts. Please try again in 5 minutes.';
  }
  
  // Handle validation errors (400)
  if (error.response.status === 400) {
    if (data.error) {
      // Backend validation errors
      if (Array.isArray(data.error)) {
        return data.error.join(', ');
      }
      return data.error;
    }
    return 'Please check your input and try again.';
  }
  
  // Handle unauthorized errors (401) - generic message to prevent user enumeration
  if (error.response.status === 401) {
    return 'Invalid email or password';
  }
  
  // Handle forbidden errors (403)
  if (error.response.status === 403) {
    return data.error || 'Your account is not verified. Please check your email.';
  }
  
  // Default: check for 'error' key, 'message' key, or 'detail'
  return data.error || data.message || data.detail || 'An error occurred. Please try again.';
};

// Async thunks
export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    // Tokens are now set as HttpOnly cookies - no need to store in localStorage
    const user = response?.user;
    
    if (!user) {
      throw new Error('Invalid response from server');
    }
    
    return { user };
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const getProfile = createAsyncThunk('auth/profile', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/auth/me');
    return response;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

// Initial state - cookie-based auth (no localStorage tokens)
const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,  // No longer using localStorage for tokens
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
      // Note: JWT cookies are cleared by the server via unset_jwt_cookies()
      // No localStorage cleanup needed since we're using HttpOnly cookies
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload?.user || null;
        // Token is now stored in HttpOnly cookies, not in state
        state.token = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Profile
      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload?.user || action.payload || null;
        state.isAuthenticated = true;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
