import { FileSystem, FileSystemNode } from './types';
import { projects, experiences } from './data';

const createFileSystem = (): FileSystem => {
  const root: FileSystemNode = {
    name: '/',
    type: 'directory',
    children: {
      home: {
        name: 'home',
        type: 'directory',
        children: {
          'welcome.txt': {
            name: 'welcome.txt',
            type: 'file',
            content: 'Welcome to my terminal portfolio! Type "help" for available commands.'
          },
          projects: {
            name: 'projects',
            type: 'directory',
            children: projects.reduce((acc, project) => ({
              ...acc,
              [`${project.name.toLowerCase().replace(/\s+/g, '-')}.md`]: {
                name: `${project.name.toLowerCase().replace(/\s+/g, '-')}.md`,
                type: 'file',
                content: `# ${project.name}\n\n${project.description}\n\nTechnologies: ${project.technologies.join(', ')}\n\n${project.link ? `[View Project](${project.link})` : ''}`
              }
            }), {})
          },
          resume: {
            name: 'resume',
            type: 'directory',
            children: {
              'experience.md': {
                name: 'experience.md',
                type: 'file',
                content: `# Work Experience\n\n${experiences.map(exp => 
                  `## ${exp.company}\n${exp.role}\n${exp.period}\n\n${exp.description.map(desc => 
                    `- ${desc}`
                  ).join('\n')}`
                ).join('\n\n')}`
              },
              'skills.txt': {
                name: 'skills.txt',
                type: 'file',
                content: `Technical Skills:
- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, PostgreSQL
- Tools: Git, Docker, AWS
- Soft Skills: Team Leadership, Mentoring, Problem Solving`
              }
            }
          },
          contact: {
            name: 'contact',
            type: 'directory',
            children: {
              'email.txt': {
                name: 'email.txt',
                type: 'file',
                content: 'Email: john@example.com'
              },
              'social.md': {
                name: 'social.md',
                type: 'file',
                content: `# Social Links\n\n- GitHub: [@johndoe](https://github.com/johndoe)\n- LinkedIn: [John Doe](https://linkedin.com/in/johndoe)`
              }
            }
          }
        }
      }
    }
  };

  return {
    currentPath: ['home'],
    root
  };
};

export const getNode = (fs: FileSystem, path: string[]): FileSystemNode | null => {
  let current = fs.root;
  
  for (const segment of path) {
    if (current.type !== 'directory' || !current.children?.[segment]) {
      return null;
    }
    current = current.children[segment];
  }
  
  return current;
};

export const getAbsolutePath = (currentPath: string[], relativePath: string): string[] => {
  if (relativePath.startsWith('/')) {
    return relativePath.split('/').filter(Boolean);
  }

  const segments = relativePath.split('/').filter(Boolean);
  const newPath = [...currentPath];

  for (const segment of segments) {
    if (segment === '..') {
      newPath.pop();
    } else if (segment !== '.') {
      newPath.push(segment);
    }
  }

  return newPath;
};

export default createFileSystem;