import { Theme } from './types';

export const themes: Record<string, Theme> = {
  matrix: {
    name: 'Matrix',
    description: 'Classic green on black terminal theme',
    styles: {
      background: 'bg-black',
      text: 'text-green-400',
      prompt: 'text-green-500',
      accent: 'text-green-300',
      selection: 'bg-green-900',
      border: 'border-green-800'
    }
  },
  amber: {
    name: 'Amber',
    description: 'Retro amber monochrome theme',
    styles: {
      background: 'bg-black',
      text: 'text-amber-400',
      prompt: 'text-amber-500',
      accent: 'text-amber-300',
      selection: 'bg-amber-900',
      border: 'border-amber-800'
    }
  },
  light: {
    name: 'Light',
    description: 'Modern light theme',
    styles: {
      background: 'bg-gray-100',
      text: 'text-gray-900',
      prompt: 'text-blue-600',
      accent: 'text-blue-500',
      selection: 'bg-blue-100',
      border: 'border-gray-300'
    }
  },
  dark: {
    name: 'Dark',
    description: 'Modern dark theme',
    styles: {
      background: 'bg-gray-900',
      text: 'text-gray-100',
      prompt: 'text-green-400',
      accent: 'text-blue-400',
      selection: 'bg-gray-700',
      border: 'border-gray-700'
    }
  }
};