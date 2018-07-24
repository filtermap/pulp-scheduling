export async function sendJSONRPCRequest<T>(method: string, params: T[] | object = []) {
  const response = await fetch('/api', { method: 'post', body: JSON.stringify({ method, params, jsonrpc: '2.0', id: 1 }) })
  return await response.json()
}

export function dateToString(date: Date): string {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}
