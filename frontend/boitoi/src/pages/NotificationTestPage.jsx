import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationService from '../services/notificationService';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const NotificationTestPage = () => {
  const [testMessage, setTestMessage] = useState('');
  const [testType, setTestType] = useState('SYSTEM');
  const [isCreating, setIsCreating] = useState(false);
  
  const { 
    notifications, 
    unreadCount, 
    isLoading,
    refreshNotifications,
    formatNotificationDate,
    getNotificationTypeInfo 
  } = useNotifications();

  const handleCreateTestNotification = async () => {
    if (!testMessage.trim()) {
      toast.error('Please enter a test message');
      return;
    }

    setIsCreating(true);
    try {
      // Get user ID from session storage
      const userId = sessionStorage.getItem('id');
      if (!userId) {
        toast.error('User not logged in');
        return;
      }

      await NotificationService.createNotification(userId, testMessage, testType);
      toast.success('Test notification created!');
      setTestMessage('');
      
      // Refresh notifications to show the new one
      setTimeout(() => {
        refreshNotifications();
      }, 1000);
      
    } catch (error) {
      console.error('Error creating test notification:', error);
      toast.error('Failed to create test notification');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateBroadcastNotification = async () => {
    setIsCreating(true);
    try {
      // Create a broadcast for all admin users (sample)
      const adminUserIds = [1, 2]; // Replace with actual admin user IDs
      await NotificationService.createBroadcastNotification(
        adminUserIds, 
        'This is a test broadcast notification for admins!', 
        'SYSTEM'
      );
      toast.success('Broadcast notification created!');
      
      setTimeout(() => {
        refreshNotifications();
      }, 1000);
      
    } catch (error) {
      console.error('Error creating broadcast notification:', error);
      toast.error('Failed to create broadcast notification');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Notification System Test</h1>
          
          {/* Test Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Create Test Notification */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Create Test Notification</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Enter test notification message..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={testType}
                    onChange={(e) => setTestType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SYSTEM">System</option>
                    <option value="ORDER">Order</option>
                    <option value="PAYMENT">Payment</option>
                    <option value="PROMOTION">Promotion</option>
                    <option value="DELIVERY">Delivery</option>
                  </select>
                </div>
                
                <Button
                  onClick={handleCreateTestNotification}
                  disabled={isCreating || !testMessage.trim()}
                  variant="primary"
                  className="w-full"
                >
                  {isCreating ? 'Creating...' : 'Create Test Notification'}
                </Button>
              </div>
            </div>

            {/* Stats & Actions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Notification Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Notifications:</span>
                  <span className="font-semibold">{notifications.length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Unread Count:</span>
                  <span className="font-semibold text-red-600">{unreadCount}</span>
                </div>
                
                <div className="space-y-2 pt-4">
                  <Button
                    onClick={refreshNotifications}
                    disabled={isLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {isLoading ? 'Loading...' : 'Refresh Notifications'}
                  </Button>
                  
                  <Button
                    onClick={handleCreateBroadcastNotification}
                    disabled={isCreating}
                    variant="secondary"
                    className="w-full"
                  >
                    Test Broadcast (Admin)
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white border rounded-lg">
            <div className="px-4 py-3 border-b bg-gray-50">
              <h2 className="text-lg font-semibold">Your Notifications</h2>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No notifications yet. Create a test notification above!
                </div>
              ) : (
                notifications.map((notification) => {
                  const typeInfo = getNotificationTypeInfo(notification.TYPE);
                  return (
                    <div
                      key={notification.ID}
                      className={`p-4 border-b hover:bg-gray-50 ${
                        notification.IS_READ ? '' : 'bg-blue-50 border-l-4 border-l-blue-500'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${typeInfo.color}`}></span>
                            <span className="text-sm font-medium text-gray-900">{typeInfo.label}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              {formatNotificationDate(notification.CREATED_AT)}
                            </span>
                            {!notification.IS_READ && (
                              <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                New
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-700 mb-2">{notification.MESSAGE}</p>
                          
                          <div className="text-xs text-gray-500">
                            ID: {notification.ID} | 
                            Status: {notification.IS_READ ? 'Read' : 'Unread'} |
                            Created: {new Date(notification.CREATED_AT).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationTestPage;
