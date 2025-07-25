'use client';

import { useState, useEffect } from 'react';

const Notification = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getNotificationStyle = () => {
    const baseStyle = "fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 transform";
    
    if (!isVisible) {
      return `${baseStyle} opacity-0 translate-x-full`;
    }

    switch (type) {
      case 'success':
        return `${baseStyle} bg-green-500 text-white`;
      case 'error':
        return `${baseStyle} bg-red-500 text-white`;
      case 'warning':
        return `${baseStyle} bg-yellow-500 text-black`;
      default:
        return `${baseStyle} bg-blue-500 text-white`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className={getNotificationStyle()}>
      <div className="flex items-center space-x-3">
        <span className="text-xl">{getIcon()}</span>
        <div className="flex-1">
          <p className="font-semibold">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-white hover:text-gray-300 font-bold text-xl"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const NotificationContainer = () => (
    <>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </>
  );

  return {
    showNotification,
    NotificationContainer
  };
};

export default Notification;
