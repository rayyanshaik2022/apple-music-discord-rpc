interface RpcApi {
  onStatusChange: (callback: (status: string) => void) => void
}

interface Window {
  rpc: RpcApi
}
