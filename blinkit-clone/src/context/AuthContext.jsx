import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const AVATARS = ['🧑', '👩', '🧔', '👱', '🧕'];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('blinkit_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const [redirectPath, setRedirectPath] = useState(null);
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('blinkit_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    if (user) localStorage.setItem('blinkit_user', JSON.stringify(user));
    else localStorage.removeItem('blinkit_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('blinkit_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const login = (phone) => {
    const existing = JSON.parse(localStorage.getItem('blinkit_user') || 'null');
    const newUser = {
      phone,
      name: existing?.name || ('User ' + phone.slice(-4)),
      avatarIndex: existing?.avatarIndex ?? (phone.charCodeAt(0) % AVATARS.length),
      savedAddresses: existing?.savedAddresses || [],
      defaultAddressId: existing?.defaultAddressId || null,
      joinedAt: existing?.joinedAt || new Date().toISOString(),
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setRedirectPath(null);
  };

  const updateUser = (updates) => {
    setUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('blinkit_user', JSON.stringify(updated));
      return updated;
    });
  };

  const addAddress = (address) => {
    const id = Date.now().toString();
    const newAddr = { ...address, id };
    updateUser({
      savedAddresses: [...(user?.savedAddresses || []), newAddr],
      defaultAddressId: user?.defaultAddressId || id,
    });
    return newAddr;
  };

  const removeAddress = (id) => {
    const remaining = (user?.savedAddresses || []).filter(a => a.id !== id);
    updateUser({
      savedAddresses: remaining,
      defaultAddressId: user?.defaultAddressId === id
        ? (remaining[0]?.id || null)
        : user?.defaultAddressId,
    });
  };

  const setDefaultAddress = (id) => updateUser({ defaultAddressId: id });

  const addNotification = (msg, icon = '🔔') => {
    const notif = { id: Date.now(), msg, icon, read: false, time: new Date().toISOString() };
    setNotifications(prev => [notif, ...prev].slice(0, 20));
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      login,
      logout,
      updateUser,
      addAddress,
      removeAddress,
      setDefaultAddress,
      redirectPath,
      setRedirectPath,
      notifications,
      addNotification,
      markAllRead,
      unreadCount,
      AVATARS,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
