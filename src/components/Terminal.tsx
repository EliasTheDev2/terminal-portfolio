import React, { useState, useRef, useEffect } from 'react';
import { Command, CommandHistory, FileSystem, ThemeName } from '../types';
import { asciiArt } from '../data';
import { Terminal as TerminalIcon, Folder, File, Monitor } from 'lucide-react';
import createFileSystem, { getNode, getAbsolutePath } from '../filesystem';
import ReactMarkdown from 'react-markdown';
import { themes } from '../themes';

const commands: Command[] = [
  {
    name: 'help',
    description: 'Show available commands',
    execute: () => (
      <div className="space-y-2">
        <p>Available commands:</p>
        {commands.map(cmd => (
          <p key={cmd.name}>• {cmd.name} - {cmd.description}</p>
        ))}
      </div>
    )
  },
  {
    name: 'ls',
    description: 'List directory contents',
    execute: (args, fs) => {
      const path = args.length > 0 ? getAbsolutePath(fs.currentPath, args[0]) : fs.currentPath;
      const node = getNode(fs, path);

      if (!node || node.type !== 'directory') {
        return 'Directory not found';
      }

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 break-all">
          {Object.entries(node.children || {}).map(([name, child]) => (
            <div key={name} className="flex items-center gap-2 min-w-0">
              {child.type === 'directory' ? (
                <Folder className="w-4 h-4 shrink-0 text-yellow-400" />
              ) : (
                <File className="w-4 h-4 shrink-0 text-blue-400" />
              )}
              <span className={`truncate ${child.type === 'directory' ? 'text-yellow-400' : ''}`}>{name}</span>
            </div>
          ))}
        </div>
      );
    }
  },
  {
    name: 'cd',
    description: 'Change directory (e.g., cd projects, cd .., cd /, cd /home)',
    execute: (args, fs) => {
      if (args.length === 0 || args[0] === '~' || args[0] === '/home') {
        fs.currentPath = ['home'];
        return '';
      }

      if (args[0] === '/') {
        fs.currentPath = [];
        return '';
      }

      if (args[0] === '.') {
        return '';
      }

      const newPath = getAbsolutePath(fs.currentPath, args[0]);
      if (newPath.join('/') === fs.currentPath.join('/')) {
        return '';
      }

      const node = getNode(fs, newPath);

      if (!node || node.type !== 'directory') {
        return 'Directory not found';
      }

      fs.currentPath = newPath;
      return '';
    }
  },
  {
    name: 'cat',
    description: 'Display file contents',
    execute: (args, fs) => {
      if (args.length === 0) {
        return 'Usage: cat <filename>';
      }

      const path = getAbsolutePath(fs.currentPath, args[0]);
      const node = getNode(fs, path);

      if (!node || node.type !== 'file') {
        return 'File not found';
      }

      if (typeof node.content === 'string' && node.name.endsWith('.md')) {
        return <ReactMarkdown className="prose prose-invert max-w-none">{node.content}</ReactMarkdown>;
      }

      return node.content;
    }
  },
  {
    name: 'pwd',
    description: 'Print working directory',
    execute: (_, fs) => `/${fs.currentPath.join('/')}`
  },
  {
    name: 'clear',
    description: 'Clear the terminal',
    execute: () => ''
  },
  {
    name: 'theme',
    description: 'Change terminal theme (usage: theme <name>)',
    execute: (args) => {
      if (args.length === 0) {
        return (
          <div className="space-y-2">
            <p>Available themes:</p>
            {Object.entries(themes).map(([key, theme]) => (
              <p key={key}>• {theme.name} - {theme.description}</p>
            ))}
          </div>
        );
      }
      return `Theme will be changed to ${args[0]}`;
    }
  },
  {
    name: 'whoami',
    description: 'Display user information',
    execute: () => (
      <div className="space-y-4">
        <pre className="text-green-400 font-mono">
{`
   _____          __         .___            
  /     \\ ___.__._/  |_  ____ |   | ____    
 /  \\ /  <   |  |\\   __\\/ __ \\|   |/    \\   
/    Y    \\___  | |  | \\  ___/|   |   |  \\  
\\____|__  / ____| |__|  \\___  >___|___|  /  
        \\/\\/                 \\/         \\/   
`}
        </pre>
        <div className="pl-4 space-y-2">
          <p>👋 Hi, I'm John Doe</p>
          <p>🚀 Full Stack Developer | Open Source Enthusiast</p>
          <p>💻 Tech Stack: React, Node.js, TypeScript</p>
          <p>🌟 Always learning, always building</p>
        </div>
      </div>
    )
  },
  {
    name: 'matrix',
    description: 'Enter the Matrix',
    execute: () => (
      <div className="space-y-2 animate-pulse">
        <p className="text-green-400">Wake up, Neo...</p>
        <p className="text-green-400">The Matrix has you...</p>
        <p className="text-green-400">Follow the white rabbit.</p>
        <p className="text-green-400">Knock, knock, Neo.</p>
      </div>
    )
  },
  {
    name: 'sudo',
    description: 'Execute a command with superuser privileges',
    execute: () => (
      <div className="space-y-2 text-red-500">
        <p>Nice try! 😄</p>
        <pre className="text-xs">
{`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣤⣤⣤⣤⣤⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⠋⠉⠀⠀⠀⠀⠈⠉⠻⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀
⠀⠀⠀⠀⠀⣰⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿⣿⣿⣿⣿⣿⣷
⠀⠀⠀⢀⣼⣿⣿⣿⣿⡟⠀⠀⠀⠀⣠⣴⣶⣶⣦⡀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⢀⣾⣿⣿⣿⣿⣿⡇⠀⠀⠀⢸⣿⣿⣿⣿⣿⣷⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⣾⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⢰⣿⣿⣿⣿⣿⣿⣿⡇⠀⣀⣀⣸⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⢸⣿⣿⣿⣿⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⢸⣿⣿⣿⣿⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠘⢿⣿⣿⣿⣿⣿⠟⠁⠻⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠙⠿⠿⠟⠁⠀⠀⠀⠈⠛⠿⠿⠿⠟⠋⠁⠀⠀⠀⠈⠛⠿⠿⠿⠿⠿⠛
`}
        </pre>
        <p>You have no power here! This is a browser, not a Linux terminal 🤓</p>
      </div>
    )
  }
];

export default function Terminal() {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const [fileSystem, setFileSystem] = useState<FileSystem>(createFileSystem());
  const [theme, setTheme] = useState<ThemeName>('dark');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [history, setHistory] = useState<CommandHistory[]>([{
    command: 'welcome',
    output: (
      <div className="space-y-2">
        <pre className="text-green-400 font-mono">{asciiArt}</pre>
        <p>Welcome to my terminal portfolio! Type 'help' to see available commands.</p>
        <p>Try exploring with: ls, cd, cat</p>
        <p>Type 'theme' to customize the terminal appearance.</p>
      </div>
    ),
    timestamp: new Date()
  }]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const updateSuggestions = (value: string) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const [cmd, ...args] = value.trim().split(' ');
    
    if (args.length === 0) {
      const cmdSuggestions = commands
        .map(c => c.name)
        .filter(name => name.startsWith(cmd.toLowerCase()));
      setSuggestions(cmdSuggestions.length > 0 ? cmdSuggestions : []);
    } else if (['cd', 'cat', 'ls'].includes(cmd.toLowerCase())) {
      const currentNode = getNode(fileSystem, fileSystem.currentPath);
      if (currentNode?.type === 'directory') {
        const lastArg = args[args.length - 1];
        const fileSuggestions = Object.keys(currentNode.children || {})
          .filter(name => name.toLowerCase().startsWith(lastArg.toLowerCase()));
        setSuggestions(fileSuggestions.length > 0 ? fileSuggestions : []);
      } else {
        setSuggestions([]);
      }
    } else if (cmd === 'theme' && args.length === 1) {
      const themeSuggestions = Object.keys(themes)
        .filter(name => name.startsWith(args[0].toLowerCase()));
      setSuggestions(themeSuggestions.length > 0 ? themeSuggestions : []);
    } else {
      setSuggestions([]);
    }
    setSelectedSuggestion(-1);
  };

  useEffect(() => {
    updateSuggestions(input);
  }, [input, fileSystem.currentPath]);

  const handleCommand = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        const suggestion = suggestions[selectedSuggestion === -1 ? 0 : selectedSuggestion];
        if (suggestion) {
          const words = input.split(' ');
          words[words.length - 1] = suggestion;
          setInput(words.join(' ') + ' ');
          setSuggestions([]);
        }
      }
      return;
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestions.length > 0) {
        const newIndex = e.key === 'ArrowUp'
          ? (selectedSuggestion <= 0 ? suggestions.length - 1 : selectedSuggestion - 1)
          : (selectedSuggestion === suggestions.length - 1 ? 0 : selectedSuggestion + 1);
        setSelectedSuggestion(newIndex);
        return;
      }

      const commandHistory = history
        .filter(entry => entry.command !== 'welcome')
        .map(entry => entry.command);

      if (commandHistory.length === 0) return;

      if (e.key === 'ArrowUp') {
        const newIndex = historyIndex === -1 
          ? commandHistory.length - 1 
          : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else if (e.key === 'ArrowDown') {
        if (historyIndex === -1) return;
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
      return;
    }

    if (e.key === 'Enter') {
      const trimmedInput = input.trim();
      if (!trimmedInput) return;

      setHistoryIndex(-1);

      const args = trimmedInput.split(' ');
      const commandName = args[0].toLowerCase();
      const command = commands.find(cmd => cmd.name === commandName);

      if (commandName === 'clear') {
        setHistory([]);
      } else if (commandName === 'theme' && args[1] && themes[args[1]]) {
        setTheme(args[1] as ThemeName);
      }
      
      const newFs = { ...fileSystem };
      const output = command 
        ? command.execute(args.slice(1), newFs)
        : `Command not found: ${commandName}. Type 'help' for available commands.`;
      
      setFileSystem(newFs);
      setHistory(prev => [...prev, {
        command: trimmedInput,
        output,
        timestamp: new Date()
      }]);
      
      setInput('');
      setSuggestions([]);
    }

    if (e.key === 'Escape') {
      setSuggestions([]);
      setSelectedSuggestion(-1);
      setHistoryIndex(-1);
      setInput('');
    }
  };

  const currentTheme = themes[theme];

  return (
    <div className={`min-h-screen ${currentTheme.styles.background} ${currentTheme.styles.text} p-2 sm:p-4 font-mono transition-colors duration-300`}>
      <div className="max-w-3xl mx-auto space-y-4">
        <div className={`flex items-center gap-2 bg-opacity-80 backdrop-blur p-2 rounded-t-lg border-b ${currentTheme.styles.border}`}>
          <TerminalIcon className="w-4 h-4 shrink-0" />
          <span className="truncate">portfolio.sh</span>
          <div className="flex-1" />
          <Monitor 
            className={`w-4 h-4 shrink-0 ${currentTheme.styles.accent} cursor-pointer`}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          />
        </div>
        
        <div className={`bg-opacity-80 backdrop-blur p-2 sm:p-4 rounded-b-lg min-h-[calc(100vh-12rem)] flex flex-col ${currentTheme.styles.border} border`}>
          <div className="flex-1 space-y-2 overflow-x-auto">
            {history.map((entry, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap min-w-0">
                  <span className={`${currentTheme.styles.prompt} shrink-0`}>visitor@portfolio</span>
                  <span className={`${currentTheme.styles.accent} shrink-0`}>~{fileSystem.currentPath.length > 1 ? '/' + fileSystem.currentPath.slice(1).join('/') : ''}$</span>
                  <span className="break-all">{entry.command}</span>
                </div>
                <div className="pl-2 sm:pl-4 break-words">{entry.output}</div>
              </div>
            ))}
          </div>
          
          <div className="relative mt-4">
            <div className="flex items-center gap-2 pt-2 flex-wrap sm:flex-nowrap min-w-0">
              <span className={`${currentTheme.styles.prompt} shrink-0`}>visitor@portfolio</span>
              <span className={`${currentTheme.styles.accent} shrink-0`}>~{fileSystem.currentPath.length > 1 ? '/' + fileSystem.currentPath.slice(1).join('/') : ''}$</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleCommand}
                className={`flex-1 bg-transparent outline-none ${currentTheme.styles.text} min-w-0`}
                autoFocus
                spellCheck={false}
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
              />
            </div>
            {suggestions.length > 0 && (
              <div className={`absolute bottom-full left-0 right-0 sm:right-auto ${currentTheme.styles.background} rounded-lg p-2 space-y-1 shadow-lg border ${currentTheme.styles.border} max-h-48 overflow-y-auto`}>
                {suggestions.map((suggestion, i) => (
                  <div
                    key={suggestion}
                    className={`px-2 py-1 rounded cursor-pointer hover:${currentTheme.styles.selection} ${i === selectedSuggestion ? currentTheme.styles.selection : ''}`}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div ref={bottomRef} />
        </div>

        <footer className="text-center py-4 opacity-70 hover:opacity-100 transition-opacity">
          <p className="text-sm animate-pulse">
            🚀 Made with 💖 by Elias from 🇩🇿 
          </p>
          <p className="text-xs mt-2">
            ⚡️ Powered by React + TypeScript + Tailwind 🎨
          </p>
        </footer>
      </div>
    </div>
  );
}