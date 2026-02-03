const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Utility for robust error extraction
const extractApiErrorMessage = (response, responseData) => {
  // Check for explicit error message from backend
  if (responseData?.error) {
    if (Array.isArray(responseData.error)) {
      return responseData.error.join(', ');
    }
    return responseData.error;
  }
  if (responseData?.message) return responseData.message;
  if (responseData?.detail) return responseData.detail;
  
  // Status-specific messages
  if (response.status === 401) return 'Invalid email or password';
  if (response.status === 403) return 'Your account is not verified';
  if (response.status === 404) return 'Resource not found';
  if (response.status === 422) return 'Validation error';
  if (response.status === 429) return 'Too many attempts. Please try again later';
  
  // Fallback
  return `Request failed with status ${response.status}`;
};

class ApiService {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      credentials: 'include',  // Enable withCredentials for cookie-based auth
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Try to parse error response as JSON
        const errorData = await response.json().catch(() => ({}));
        throw new Error(extractApiErrorMessage(response, errorData));
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint, data) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

const api = new ApiService();
export default api;
