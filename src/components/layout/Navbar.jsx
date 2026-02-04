import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, updateProfile } from '../../features/auth/authSlice';
import { ShoppingCart, Package, Heart, Settings, LogOut, User, Menu, X, Image as ImageIcon } from 'lucide-react';

// Simple avatar component
const UserAvatar = ({ size = "h-10 w-10" }) => {
  const { user } = useSelector((state) => state.auth);
  const profileImage = user?.profile_image_url || user?.profile?.profile_image_url;
  
  if (profileImage) {
    return (
      <img 
        src={profileImage} 
        alt="Profile" 
        className={`${size} rounded-full object-cover border-2 border-green-500`}
      />
    );
  }
  
  return (
    <div className={`${size} rounded-full bg-green-100 flex items-center justify-center border-2 border-green-500`}>
      <User className="w-5 h-5 text-green-600" />
    </div>
  );
};

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart?.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
    setIsDropdownOpen(false);
  };

  const handleRemovePhoto = async () => {
    try {
      await dispatch(updateProfile({ profile_image_url: null })).unwrap();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Failed to remove photo:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🐄</span>
            <span className="text-xl font-bold text-green-600">FarmAT</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Browse Marketplace Link */}
            <Link 
              to="/browse" 
              className="text-gray-600 hover:text-green-600 font-medium"
            >
              Browse Marketplace
            </Link>

            {isAuthenticated ? (
              <>
                {/* Cart Badge */}
                <Link to="/dashboard/cart" className="relative text-gray-600 hover:text-green-600">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1 cursor-pointer group"
                  >
                    <UserAvatar size="h-9 w-9" />
                    <svg 
                      className={`w-4 h-4 text-gray-500 group-hover:text-green-600 transition-colors ${isDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-20">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-medium text-gray-800">
                            {user?.first_name} {user?.last_name}
                          </p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full capitalize">
                            {user?.role || 'Buyer'}
                          </span>
                        </div>

                        {/* Navigation Links */}
                        <div className="py-1">
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-green-600"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <User className="w-4 h-4" />
                            My Dashboard
                          </Link>

                          {user?.role === 'buyer' && (
                            <>
                              <Link
                                to="/dashboard/orders"
                                className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-green-600"
                                onClick={() => setIsDropdownOpen(false)}
                              >
                                <Package className="w-4 h-4" />
                                My Orders
                              </Link>
                              <Link
                                to="/dashboard/favorites"
                                className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-green-600"
                                onClick={() => setIsDropdownOpen(false)}
                              >
                                <Heart className="w-4 h-4" />
                                Saved Items
                              </Link>
                            </>
                          )}

                          <Link
                            to="/settings"
                            className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-green-600"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            Account Settings
                          </Link>

                          {/* Remove Photo Option */}
                          {(user?.profile_image_url || user?.profile?.profile_image_url) && (
                            <button
                              onClick={handleRemovePhoto}
                              className="flex items-center gap-3 w-full px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-rose-600"
                            >
                              <ImageIcon className="w-4 h-4" />
                              Remove Photo
                            </button>
                          )}
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-100 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-green-600 font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link
                to="/browse"
                className="text-gray-600 hover:text-green-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Marketplace
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-green-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/cart"
                    className="text-gray-600 hover:text-green-600 font-medium flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Cart ({cartItems.length})
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 font-medium text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-green-600 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
