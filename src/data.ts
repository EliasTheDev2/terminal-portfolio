import { Project, Experience } from './types';

export const projects: Project[] = [
  {
    name: 'Terminal Portfolio',
    description: 'An innovative portfolio website styled as a terminal interface',
    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
    link: 'https://github.com/EliasTheDev2/terminal-portfolio'
  },
  // Add more projects here
];

export const experiences: Experience[] = [
  {
    company: 'Tech Corp',
    role: 'Senior Frontend Developer',
    period: '2021 - Present',
    description: [
      'Led development of mission-critical web applications',
      'Mentored junior developers and conducted code reviews',
      'Implemented modern frontend architectures using React and TypeScript'
    ]
  },
  // Add more experiences here
];

export const asciiArt = `
 _____                    _             _ 
|_   _|__ _ __ _ __ ___ (_)_ __   __ _| |
  | |/ _ \\ '__| '_ \` _ \\| | '_ \\ / _\` | |
  | |  __/ |  | | | | | | | | | | (_| | |
  |_|\\___|_|  |_| |_| |_|_|_| |_|\\__,_|_|
                                          
`;