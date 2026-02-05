import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { register } from '../features/auth/authSlice';

// Phone number validation regex - more lenient for various Kenyan formats
const KENYAN_PHONE_REGEX = /^(?:\+?254|0)?[71][0-9]{8}$/;

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Name validation - allow letters, spaces, hyphens, and apostrophes
const NAME_REGEX = /^[a-zA-Z][a-zA-Z\s\-']*$/;

// Password validation utility (matches backend requirements)
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

// Phone validation utility - more lenient
const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  // Remove any spaces or dashes
  const cleanPhone = phone.replace(/[\s-]/g, '');
  // Accept formats: 07XX XXX XXXX, 254XXXXXXXXX, +254XXXXXXXXX
  if (!KENYAN_PHONE_REGEX.test(cleanPhone) && !/^254[0-9]{9}$/.test(cleanPhone)) {
    return 'Please enter a valid Kenyan phone number (e.g., 07XXXXXXXX)';
  }
  return null;
};

// Name validation utility
const validateName = (value, fieldName) => {
  if (!value.trim()) return `${fieldName} is required`;
  if (value.trim().length < 2) return `${fieldName} must be at least 2 characters`;
  if (!NAME_REGEX.test(value.trim())) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
  }
  return null;
};

// Email validation utility
const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!EMAIL_REGEX.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'buyer'
  });
  const [localError, setLocalError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error: reduxError, loading } = useAppSelector((state) => state.auth);

  // Phone number masking - only allow digits 0-9 and +
  const handlePhoneChange = (e) => {
    const newValue = e.target.value;
    // Filter: only allow digits 0-9 and + symbol
    if (!/^[0-9+]*$/.test(newValue)) return;
    setFormData({ ...formData, phone: newValue });
    setPhoneError('');
    setLocalError('');
  };

  // Name field handler - allow letters, spaces, hyphens
  const handleNameChange = (e) => {
    const newValue = e.target.value;
    // Only allow letters, spaces, hyphens, and apostrophes
    if (!/^[a-zA-Z\s\-']*$/.test(newValue)) return;
    setFormData({ ...formData, [e.target.name]: newValue });
    setLocalError('');
    // Clear field error when user types
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    }
  };

  // Generic change handler for other fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setLocalError('');
    if (e.target.name === 'password') {
      setPasswordError('');
    }
    // Clear field error when user types
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: null });
    }
  };

  // Validate all form fields
  const validateForm = () => {
    const errors = {};

    // Validate firstName
    const firstNameError = validateName(formData.firstName, 'First name');
    if (firstNameError) errors.firstName = firstNameError;

    // Validate lastName
    const lastNameError = validateName(formData.lastName, 'Last name');
    if (lastNameError) errors.lastName = lastNameError;

    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    // Validate phone
    const phoneErrorMsg = validatePhone(formData.phone);
    if (phoneErrorMsg) {
      errors.phone = phoneErrorMsg;
      setPhoneError(phoneErrorMsg);
    }

    // Validate password
    const passwordErrorMsg = validatePassword(formData.password);
    if (passwordErrorMsg) {
      errors.password = passwordErrorMsg;
      setPasswordError(passwordErrorMsg);
    }

    // Validate confirm password
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Check if form is valid for button disable state
  const isFormValid = () => {
    return (
      formData.firstName.trim().length >= 2 &&
      formData.lastName.trim().length >= 2 &&
      EMAIL_REGEX.test(formData.email) &&
      formData.phone.replace(/[\s-]/g, '').length >= 10 &&
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword &&
      formData.role
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setPasswordError('');
    setPhoneError('');
    setFieldErrors({});

    // Run full validation before submission
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(register({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phone,
        password: formData.password,
        role: formData.role
      })).unwrap();
      navigate('/login');
    } catch (err) {
      // Handle both string errors (from rejectWithValue) and Error objects
      const errorMessage = typeof err === 'string' ? err : (err.message || err || 'Registration failed');
      setLocalError(errorMessage);
    }
  };

  // Use local error or Redux error
  const displayError = localError || reduxError;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create FarmAT Account</h2>
        
        {displayError && typeof displayError === 'string' && (
          <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{displayError}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleNameChange}
                placeholder="e.g., John"
                className={`mt-1 w-full px-4 py-2 border rounded-lg ${fieldErrors.firstName ? 'border-red-500' : ''}`}
                required
              />
              {fieldErrors.firstName && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleNameChange}
                placeholder="e.g., Doe"
                className={`mt-1 w-full px-4 py-2 border rounded-lg ${fieldErrors.lastName ? 'border-red-500' : ''}`}
                required
              />
              {fieldErrors.lastName && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`mt-1 w-full px-4 py-2 border rounded-lg ${fieldErrors.email ? 'border-red-500' : ''}`}
              required
            />
            {fieldErrors.email && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="07XXXXXXXX or 254XXXXXXXXX"
              className={`mt-1 w-full px-4 py-2 border rounded-lg ${fieldErrors.phone ? 'border-red-500' : ''}`}
              required
            />
            {fieldErrors.phone || phoneError ? (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.phone || phoneError}</p>
            ) : (
              <p className="text-gray-500 text-xs mt-1">Enter a valid Kenyan mobile number (07X XXX XXXX)</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">I am a</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg"
            >
              <option value="buyer">Buyer</option>
              <option value="farmer">Farmer</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 w-full px-4 py-2 border rounded-lg ${fieldErrors.password || passwordError ? 'border-red-500' : ''}`}
              required
            />
            {fieldErrors.password || passwordError ? (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.password || passwordError}</p>
            ) : (
              <p className="text-gray-500 text-xs mt-1">
                Must contain: 8+ chars, uppercase, lowercase, number, special char (@$!%*?&)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`mt-1 w-full px-4 py-2 border rounded-lg ${fieldErrors.confirmPassword ? 'border-red-500' : ''}`}
              required
            />
            {fieldErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid() || loading}
            className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
              isFormValid() && !loading
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
