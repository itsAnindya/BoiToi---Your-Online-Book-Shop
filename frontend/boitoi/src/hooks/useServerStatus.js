// src/hooks/useServerStatus.js
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config'; // Adjust the import path as necessary

export function useServerStatus(interval = 10_000) {
  const [isOnline, setIsOnline] = useState(undefined);      // undefined = not checked yet

  useEffect(() => {
    let timer;

    const ping = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/health`, { cache: 'no-store' });
        setIsOnline(res.ok);
        console.log('Server is online:', res.ok);
      } catch {
        setIsOnline(false);
        console.error('Server is offline or unreachable');
      }
      timer = setTimeout(ping, interval);                   // re‑check
    };

    ping();                                                 // first run
    return () => clearTimeout(timer);                       // cleanup on unmount
  }, [interval]);

  return isOnline;                                          // true / false / undefined
}
export default useServerStatus;                             // for easy import