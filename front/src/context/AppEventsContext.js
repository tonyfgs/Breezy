'use client';

import { createContext, useContext, useState, useCallback } from 'react';

const AppEventsContext = createContext(null);

export function AppEventsProvider({ children }) {
  // Chaque incrément déclenche un re-fetch dans les pages abonnées.
  const [feedVersion, setFeedVersion] = useState(0);
  const [ownPostsVersion, setOwnPostsVersion] = useState(0);

  const notifyPostCreated = useCallback(() => {
    setFeedVersion(v => v + 1);
    setOwnPostsVersion(v => v + 1);
  }, []);

  const notifyFollowChanged = useCallback(() => {
    setFeedVersion(v => v + 1);
  }, []);

  return (
    <AppEventsContext.Provider value={{ feedVersion, ownPostsVersion, notifyPostCreated, notifyFollowChanged }}>
      {children}
    </AppEventsContext.Provider>
  );
}

export function useAppEvents() {
  const ctx = useContext(AppEventsContext);
  if (!ctx) throw new Error('useAppEvents must be used inside AppEventsProvider');
  return ctx;
}
