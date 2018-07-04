export async function sendJSONRPCRequest<T>(method: string, params: T[] | object = []) {
  const response = await fetch('/api', { method: 'post', body: JSON.stringify({ method, params, jsonrpc: '2.0', id: 1 }) })
  return await response.json()
}
