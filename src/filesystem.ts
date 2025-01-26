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
            children: {
              'README.md': {
                name: 'README.md',
                type: 'file',
                content: '# Projects Directory\n\nThis directory contains information about my projects. Each project is documented in its own markdown file.\n\nUse `ls` to list all projects and `cat <filename>` to read about a specific project.'
              },
              ...projects.reduce((acc, project) => ({
                ...acc,
                [`${project.name.toLowerCase().replace(/\s+/g, '-')}.md`]: {
                  name: `${project.name.toLowerCase().replace(/\s+/g, '-')}.md`,
                  type: 'file',
                  content: `# ${project.name}\n\n${project.description}\n\nTechnologies: ${project.technologies.join(', ')}\n\n${project.link ? `[View Project](${project.link})` : ''}`
                }
              }), {})
            }
          },
          resume: {
            name: 'resume',
            type: 'directory',
            children: {
              'README.md': {
                name: 'README.md',
                type: 'file',
                content: '# Resume Directory\n\nThis directory contains my professional experience and skills.\n\nFiles available:\n- experience.md: Detailed work history\n- skills.txt: Technical and soft skills\n- education.md: Educational background'
              },
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
              },
              'education.md': {
                name: 'education.md',
                type: 'file',
                content: `# Education\n\n## University Name\nBachelor of Science in Computer Science\n2016 - 2020\n\n- Relevant Coursework: Data Structures, Algorithms, Web Development\n- GPA: 3.8/4.0\n- Activities: Programming Club President, Hackathon Organizer`
              }
            }
          },
          contact: {
            name: 'contact',
            type: 'directory',
            children: {
              'README.md': {
                name: 'README.md',
                type: 'file',
                content: '# Contact Directory\n\nThis directory contains my contact information and social media links.\n\nFiles available:\n- email.txt: Email address\n- social.md: Social media profiles\n- about.md: More about me'
              },
              'email.txt': {
                name: 'email.txt',
                type: 'file',
                content: 'Email: john@example.com'
              },
              'social.md': {
                name: 'social.md',
                type: 'file',
                content: `# Social Links\n\n- GitHub: [@EliasTheDev2](https://github.com/EliasTheDev2)\n- LinkedIn: [John Doe](https://linkedin.com/in/johndoe)\n- Twitter: [@johndoe](https://twitter.com/johndoe)\n- Portfolio: [johndoe.dev](https://johndoe.dev)`
              },
              'about.md': {
                name: 'about.md',
                type: 'file',
                content: `# About Me\n\nHi! I'm John Doe, a passionate Full Stack Developer with a love for creating elegant solutions to complex problems. I specialize in modern web technologies and have a keen interest in user experience and performance optimization.\n\n## Interests\n- Open Source Software\n- Web Performance\n- UI/UX Design\n- Tech Community Building\n\n## Hobbies\n- Contributing to Open Source\n- Writing Technical Blog Posts\n- Attending Tech Meetups\n- Photography`
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