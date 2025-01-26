import { ReactNode } from 'react';

export interface Command {
  name: string;
  description: string;
  execute: (args: string[], fs: FileSystem) => string | ReactNode;
}

export interface CommandHistory {
  command: string;
  output: string | ReactNode;
  timestamp: Date;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string[];
}

export interface FileSystemNode {
  name: string;
  type: 'file' | 'directory';
  content?: string | ReactNode;
  children?: { [key: string]: FileSystemNode };
}

export interface FileSystem {
  currentPath: string[];
  root: FileSystemNode;
}

export interface Theme {
  name: string;
  description: string;
  styles: {
    background: string;
    text: string;
    prompt: string;
    accent: string;
    selection: string;
    border: string;
  };
}

export type ThemeName = 'matrix' | 'amber' | 'light' | 'dark';