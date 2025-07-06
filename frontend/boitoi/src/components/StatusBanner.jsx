import React from 'react';
import useServerStatus from '../hooks/useServerStatus';

export default function StatusBanner() {
  const online = useServerStatus();

  if (online === undefined) {
    return <p>🔄 Checking server status…</p>;
  }
  if (online) {
    return <p>🟢 Connected to API</p>;
  }
  return                        <p>🔴 Cannot connect to server</p>;
}
