import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatCurrency(amount: string): string {
  return amount
}

export function getDaysUntil(date: Date | string): number {
  const now = new Date()
  const target = new Date(date)
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
]

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🏳️' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🏳️' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🏳️' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🏳️' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🏳️' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🏳️' },
]

export const SUGGESTED_PROMPTS = [
  'How do I register to vote in India?',
  'What documents do I need for voter ID?',
  'How does the EVM (Electronic Voting Machine) work?',
  'What is the Model Code of Conduct?',
  'Can I vote if I moved to a new city?',
  'How do I check my name on the voter list?',
  'What is NOTA and how do I use it?',
  'When is the next election in my state?',
]

export const HINDI_PROMPTS = [
  'मतदाता पंजीकरण कैसे करें?',
  'वोटर आईडी के लिए कौन से दस्तावेज चाहिए?',
  'ईवीएम कैसे काम करता है?',
  'आदर्श आचार संहिता क्या है?',
]
