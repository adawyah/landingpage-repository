import React, { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import "./BellNotifications.css";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import axios from "axios";

// Enable Pusher logging for debugging - remove in production
window.Pusher = Pusher;
Pusher.logToConsole = true;

// Notification debug logging
const debug = (message, data) => {
  console.log(`[Notifications] ${message}`, data || '');
};

const BellNotifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications
  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        debug('Fetching notifications...');
        const token = localStorage.getItem('token');
        if (!token) {
          debug('No auth token found');
          return;
        }

        const response = await axios.get("/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        });
        
        debug('Notifications response:', response.data);
        setNotifications(response.data.all);
        setUnreadCount(response.data.unread.length);
      } catch (err) {
        debug('Failed to fetch notifications:', err.response?.data || err.message);
      }
    };
    
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(intervalId);
  }, [userId]);

  // WebSocket connection
  useEffect(() => {
    if (!userId) return;

    let echo;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        debug('No auth token found');
        return;
      }

      echo = new Echo({
        broadcaster: "pusher",
        key: import.meta.env.VITE_PUSHER_APP_KEY || 'local',
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
        wsHost: import.meta.env.VITE_PUSHER_HOST || '127.0.0.1',
        wsPort: parseInt(import.meta.env.VITE_PUSHER_PORT || '6001'),
        forceTLS: false,
        encrypted: false,
        enableStats: false,
        enabledTransports: ["ws", "wss"],
        auth: {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          }
        },
        authEndpoint: 'http://localhost:8000/broadcasting/auth'
      });

      debug('Echo instance created');

      // Connection status
      echo.connector.pusher.connection.bind('connected', () => {
        debug('Connected to Pusher');
      });

      echo.connector.pusher.connection.bind('disconnected', () => {
        debug('Disconnected from Pusher');
      });

      echo.connector.pusher.connection.bind('error', (err) => {
        debug('Pusher connection error:', err);
      });

      // Subscribe to notifications
      const channel = echo.private(`App.Models.User.${userId}`);
      
      channel.notification((notification) => {
        debug('Received notification:', notification);
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });

      channel.error((err) => {
        debug('Channel subscription error:', err);
      });
    } catch (error) {
      debug('Error in notification setup:', error);
    }

    return () => {
      if (echo) {
        debug('Cleaning up Echo connection');
        echo.disconnect();
      }
    };
  }, [userId]);

  const toggleDropdown = () => setOpen(!open);

  const markAsRead = async (id) => {
    try {
      debug('Marking notification as read:', id);
      await axios.post(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read_at: new Date().toISOString() } : notif
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      debug('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      debug('Marking all notifications as read');
      await axios.post('/notifications/mark-all-read');
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (err) {
      debug('Failed to mark all notifications as read:', err);
    }
  };

  return (
    <div className="bell-notifications" ref={dropdownRef} style={{ position: "relative", zIndex: 1000 }}>
      <div className="icon-box" onClick={toggleDropdown} style={{ cursor: "pointer" }}>
        <Bell size={20} />
        {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
      </div>

      {open && (
        <div className="notif-dropdown">
          {notifications.length === 0 ? (
            <div className="notif-item">No notifications yet</div>
          ) : (
            <>
              {unreadCount > 0 && (
                <div className="notif-actions">
                  <button onClick={(e) => { e.stopPropagation(); markAllAsRead(); }} className="mark-all-read">
                    Mark all as read
                  </button>
                </div>
              )}
              {notifications.map((notif) => {
                const statusColor = notif.data.status === 'approved' ? '#4CAF50' : '#F44336';
                return (
                  <div
                    key={notif.id}
                    className="notif-item"
                    onClick={() => markAsRead(notif.id)}
                    style={{ 
                      background: notif.read_at ? "#fff" : "#eef", 
                      cursor: "pointer",
                      borderLeft: `4px solid ${statusColor}`
                    }}
                  >
                    <div className="notif-title" style={{ color: statusColor }}>
                      {notif.data.title}
                    </div>
                    <div className="notif-message">{notif.data.message}</div>
                    {notif.data.remarks && (
                      <div className="notif-remarks">
                        <strong>Remarks:</strong> {notif.data.remarks}
                      </div>
                    )}
                    <div className="notif-time">
                      {new Date(notif.created_at).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BellNotifications;