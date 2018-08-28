export async function sendJSONRPCRequest<T>(method: string, params: T[] | object = []) {
  const response = await fetch('/api', { method: 'post', body: JSON.stringify({ method, params, jsonrpc: '2.0', id: 1 }) })
  return await response.json()
}

const dateStringPattern = /^(\d{4})-(\d{1,2})-(\d{1,2})$/

export function stringToDate(dateString: string): Date | null {
  const match = dateString.match(dateStringPattern)
  if (!match) { return null }
  const [, year, monthIndex, day] = match
  return new Date(parseInt(year, 10), parseInt(monthIndex, 10) - 1, parseInt(day, 10))
}

export function dateToString(date: Date): string {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function intersperse<T, U>(array: T[], separator: U): Array<T | U> {
  return array.reduce((accumulator, current) => [...accumulator, separator, current], []).slice(1)
}
