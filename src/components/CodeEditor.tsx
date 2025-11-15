import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

type Language = 'javascript' | 'python';

interface Variable {
  name: string;
  value: any;
  type: string;
}

const CodeEditor = () => {
  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState('// Введите код JavaScript\nconst x = 10;\nconst y = 20;\nconsole.log(x + y);');
  const [output, setOutput] = useState<string[]>([]);
  const [variables, setVariables] = useState<Variable[]>([]);
  const [error, setError] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const templates: Record<Language, string> = {
    javascript: `// Пример JavaScript
const numbers = [1, 2, 3, 4, 5];
let sum = 0;

for (const num of numbers) {
    sum += num;
}

console.log('Сумма:', sum);`,
    python: `# Пример Python (эмулируется в JS)
numbers = [1, 2, 3, 4, 5]
sum = 0

for num in numbers:
    sum += num

print('Сумма:', sum)`
  };

  const executePython = (code: string): { output: string[], variables: Variable[] } => {
    const output: string[] = [];
    const vars: Record<string, any> = {};

    const lines = code.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      if (trimmed.startsWith('print(')) {
        const content = trimmed.slice(6, -1);
        try {
          const result = eval(content.replace(/'/g, '"'));
          output.push(String(result));
        } catch {
          const parts = content.split(',').map(p => p.trim().replace(/['"]/g, ''));
          output.push(parts.join(' '));
        }
      }
      
      else if (trimmed.includes('=') && !trimmed.includes('==')) {
        const [varName, value] = trimmed.split('=').map(s => s.trim());
        try {
          if (value.startsWith('[') && value.endsWith(']')) {
            vars[varName] = JSON.parse(value);
          } else if (!isNaN(Number(value))) {
            vars[varName] = Number(value);
          } else if (value.startsWith('"') || value.startsWith("'")) {
            vars[varName] = value.slice(1, -1);
          } else if (value in vars) {
            vars[varName] = vars[value];
          } else {
            vars[varName] = value;
          }
        } catch {
          vars[varName] = value;
        }
      }
    }

    const variables = Object.entries(vars).map(([name, value]) => ({
      name,
      value,
      type: Array.isArray(value) ? 'list' : typeof value
    }));

    return { output, variables };
  };

  const executeJavaScript = (code: string): { output: string[], variables: Variable[] } => {
    const output: string[] = [];
    const vars: Variable[] = [];
    
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      output.push(args.map(a => String(a)).join(' '));
    };

    try {
      const wrappedCode = `
        (function() {
          ${code}
          
          const localVars = [];
          for (const key in this) {
            if (this.hasOwnProperty(key)) {
              localVars.push({
                name: key,
                value: this[key],
                type: Array.isArray(this[key]) ? 'array' : typeof this[key]
              });
            }
          }
          return localVars;
        })()
      `;
      
      const result = eval(wrappedCode);
      if (result) {
        vars.push(...result);
      }
    } catch (err: any) {
      throw err;
    } finally {
      console.log = originalLog;
    }

    return { output, variables: vars };
  };

  const handleRun = () => {
    setError('');
    setOutput([]);
    setVariables([]);
    setIsRunning(true);

    setTimeout(() => {
      try {
        let result;
        
        if (language === 'python') {
          result = executePython(code);
        } else {
          result = executeJavaScript(code);
        }

        setOutput(result.output);
        setVariables(result.variables);
      } catch (err: any) {
        setError(err.message || 'Ошибка выполнения кода');
      } finally {
        setIsRunning(false);
      }
    }, 300);
  };

  const loadTemplate = () => {
    setCode(templates[language]);
    setOutput([]);
    setVariables([]);
    setError('');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="bg-slate-900/50 border-slate-700 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-2xl text-slate-100">
              <Icon name="Code" size={24} className="text-primary" />
              Редактор кода
            </CardTitle>
            <div className="flex gap-2">
              <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                <SelectTrigger className="w-[180px] bg-slate-800 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python (эмуляция)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <CardDescription className="text-slate-400">
            Напишите код и нажмите "Выполнить" для запуска
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono text-sm bg-slate-950 border-slate-700 text-slate-100 min-h-[400px] resize-none"
              placeholder="Введите код..."
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleRun} 
              disabled={isRunning}
              className="flex-1 h-12"
              size="lg"
            >
              <Icon name={isRunning ? "Loader2" : "Play"} size={20} className={cn("mr-2", isRunning && "animate-spin")} />
              {isRunning ? 'Выполняется...' : 'Выполнить'}
            </Button>
            <Button 
              onClick={loadTemplate} 
              variant="outline"
              className="h-12"
            >
              <Icon name="FileCode" size={20} className="mr-2" />
              Шаблон
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <Icon name="AlertCircle" size={18} />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="bg-slate-900/50 border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-slate-100">
              <Icon name="Terminal" size={20} className="text-accent" />
              Вывод программы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[200px] p-4 bg-slate-950 rounded-lg border border-slate-700 font-mono text-sm">
              {output.length > 0 ? (
                <div className="space-y-1">
                  {output.map((line, idx) => (
                    <div key={idx} className="text-accent">
                      {line}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-600 italic">
                  Вывод программы появится здесь...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-slate-100">
              <Icon name="Database" size={20} className="text-secondary" />
              Состояние переменных
            </CardTitle>
          </CardHeader>
          <CardContent>
            {variables.length > 0 ? (
              <div className="space-y-3">
                {variables.map((variable, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-950 rounded-lg border border-slate-700 hover:border-secondary transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono font-semibold text-secondary">
                        {variable.name}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {variable.type}
                      </Badge>
                    </div>
                    <div className="font-mono text-sm text-slate-300">
                      {typeof variable.value === 'object' 
                        ? JSON.stringify(variable.value) 
                        : String(variable.value)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-600">
                <Icon name="Variable" size={48} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm italic">Переменные появятся после выполнения кода</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CodeEditor;
