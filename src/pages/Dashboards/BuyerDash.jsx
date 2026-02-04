import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile } from '../../features/auth/authSlice';
import { getOrders } from '../../features/checkout/cartSlice';
import { Package, ShoppingCart, Heart, TrendingUp, ArrowRight, Search } from 'lucide-react';
import UserAvatarHandler from '../../components/common/UserAvatarHandler';

const BuyerDash = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getProfile());
      dispatch(getOrders());
    }
  }, [dispatch, isAuthenticated]);

  // Safe data extraction with fallbacks
  const recentOrders = orders?.slice(0, 5) || [];
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter(o => o?.status === 'pending').length || 0;

  const stats = [
    { 
      label: 'Total Orders', 
      value: totalOrders, 
      icon: Package, 
      color: 'bg-blue-500',
      link: '/dashboard/orders'
    },
    { 
      label: 'Pending', 
      value: pendingOrders, 
      icon: ShoppingCart, 
      color: 'bg-yellow-500',
      link: '/dashboard/orders?status=pending'
    },
    { 
      label: 'Saved Items', 
      value: '0', 
      icon: Heart, 
      color: 'bg-red-500',
      link: '/dashboard/favorites'
    },
    { 
      label: 'Total Spent', 
      value: 'KES 0', 
      icon: TrendingUp, 
      color: 'bg-green-500',
      link: '/dashboard/orders'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <UserAvatarHandler size="h-20 w-20" />
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back, {user?.first_name || 'Farmer'}! 👋
              </h1>
              <p className="text-green-100">
                Manage your livestock marketplace account
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.link}
              className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
              <Link to="/dashboard/orders" className="text-green-600 hover:text-green-700 text-sm font-medium">
                View All
              </Link>
            </div>
            
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Package className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{order.livestock?.name || 'Livestock'}</p>
                        <p className="text-sm text-gray-500">{order.created_at}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">KES {order.total_amount?.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No orders yet</p>
                <Link 
                  to="/browse" 
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Search className="w-4 h-4" />
                  Browse Animals
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link 
                to="/browse"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 p-2 rounded-lg">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Browse Marketplace</p>
                    <p className="text-sm text-gray-500">Find your next livestock</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-green-600" />
              </Link>

              <Link 
                to="/dashboard/orders"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">View Orders</p>
                    <p className="text-sm text-gray-500">Track your purchases</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-600" />
              </Link>

              <Link 
                to="/dashboard/favorites"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg hover:from-red-100 hover:to-red-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-red-500 p-2 rounded-lg">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Saved Items</p>
                    <p className="text-sm text-gray-500">Your wishlist</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-red-600" />
              </Link>

              <Link 
                to="/settings"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gray-500 p-2 rounded-lg">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Account Settings</p>
                    <p className="text-sm text-gray-500">Manage your profile</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600" />
              </Link>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { icon: '🛒', text: 'Browse livestock available for sale', time: '2 hours ago' },
              { icon: '📦', text: 'Check your recent orders', time: '1 day ago' },
              { icon: '💚', text: 'Save items to your wishlist', time: '2 days ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                <span className="text-xl">{activity.icon}</span>
                <div>
                  <p className="text-gray-700">{activity.text}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDash;
