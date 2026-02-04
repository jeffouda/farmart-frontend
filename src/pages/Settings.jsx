import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import ProfilePicture from '../components/profile/ProfilePicture';
import ProfileEdit from '../components/common/ProfileEdit';
import { useSelector } from 'react-redux';
import { User, Bell, Shield, CreditCard } from 'lucide-react';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="border-b px-6 py-4 bg-gray-50">
            <nav className="flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 capitalize transition-colors ${
                    activeTab === tab.id 
                      ? 'text-green-600 font-semibold' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="max-w-2xl">
                {/* Profile Picture Section */}
                <div className="mb-8 flex justify-center">
                  <ProfilePicture />
                </div>

                {/* Profile Edit Form */}
                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                  <ProfileEdit />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                <p className="text-gray-500">Notification settings coming soon...</p>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
                <p className="text-gray-500">Security settings coming soon...</p>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="max-w-2xl">
                <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
                <p className="text-gray-500">Payment settings coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
