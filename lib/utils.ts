import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetchTopData() {
  try {
    const response = await fetch(`${process.env.API_URL}/api/top`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    const result = await response.json()
    // console.log('top values are', result)}
    return result
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
