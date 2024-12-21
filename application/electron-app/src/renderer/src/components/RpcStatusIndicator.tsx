import { useState, useEffect } from 'react'

declare global {
  interface Window {
    rpc: {
      onStatusChange: (callback: (newStatus: string) => void) => void
    }
  }
}

const RpcStatusIndicator = () => {
  const [status, setStatus] = useState('connecting') // Default status

  useEffect(() => {
    if (window?.rpc) {
      window?.rpc.onStatusChange((newStatus) => {
        setStatus(newStatus)
      })
    }
  }, [])

  return (
    <div>
      <p>Discord RPC Status: {status}</p>
      {status === 'connected' && <span style={{ color: 'green' }}>🟢 Connected</span>}
      {status === 'connecting' && <span style={{ color: 'orange' }}>🟠 Connecting</span>}
      {status === 'disconnected' && <span style={{ color: 'red' }}>🔴 Disconnected</span>}
    </div>
  )
}

export default RpcStatusIndicator
