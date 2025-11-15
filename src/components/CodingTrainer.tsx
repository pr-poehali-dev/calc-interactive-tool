import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface Task {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  template: string;
  tests: Array<{ input: any; expected: any }>;
  hint: string;
}

interface TestResult {
  passed: boolean;
  input: any;
  expected: any;
  actual: any;
}

const CodingTrainer = () => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [code, setCode] = useState('');
  const [results, setResults] = useState<TestResult[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

  const tasks: Task[] = [
    {
      id: 1,
      title: 'Сумма массива',
      description: 'Напишите функцию, которая вычисляет сумму всех элементов массива.',
      difficulty: 'easy',
      template: `function sumArray(arr) {
  // Ваш код здесь
  
}`,
      tests: [
        { input: [1, 2, 3, 4, 5], expected: 15 },
        { input: [10, 20, 30], expected: 60 },
        { input: [0, 0, 0], expected: 0 },
        { input: [-5, 5, -10, 10], expected: 0 }
      ],
      hint: 'Используйте цикл для перебора массива и переменную для накопления суммы.'
    },
    {
      id: 2,
      title: 'Простые числа',
      description: 'Напишите функцию, которая находит все простые числа до N.',
      difficulty: 'medium',
      template: `function findPrimes(n) {
  // Ваш код здесь
  
}`,
      tests: [
        { input: 10, expected: [2, 3, 5, 7] },
        { input: 20, expected: [2, 3, 5, 7, 11, 13, 17, 19] },
        { input: 5, expected: [2, 3, 5] }
      ],
      hint: 'Простое число делится только на 1 и само себя. Проверьте делимость на все числа от 2 до √n.'
    },
    {
      id: 3,
      title: 'Сортировка массива',
      description: 'Напишите функцию, которая сортирует массив по возрастанию (без встроенных методов сортировки).',
      difficulty: 'hard',
      template: `function sortArray(arr) {
  // Ваш код здесь
  // Используйте любой алгоритм: пузырьковая, выбором, вставками
  
}`,
      tests: [
        { input: [5, 2, 8, 1, 9], expected: [1, 2, 5, 8, 9] },
        { input: [3, 3, 1, 2], expected: [1, 2, 3, 3] },
        { input: [10, 5, 0, -5], expected: [-5, 0, 5, 10] }
      ],
      hint: 'Попробуйте пузырьковую сортировку: сравнивайте соседние элементы и меняйте местами, если они в неправильном порядке.'
    },
    {
      id: 4,
      title: 'Палиндром',
      description: 'Напишите функцию, которая проверяет, является ли строка палиндромом (читается одинаково слева направо и справа налево).',
      difficulty: 'easy',
      template: `function isPalindrome(str) {
  // Ваш код здесь
  
}`,
      tests: [
        { input: 'radar', expected: true },
        { input: 'hello', expected: false },
        { input: 'level', expected: true },
        { input: 'a', expected: true }
      ],
      hint: 'Сравните строку с её обратной версией или используйте два указателя с начала и конца.'
    },
    {
      id: 5,
      title: 'Факториал',
      description: 'Напишите функцию, которая вычисляет факториал числа N (N! = 1 × 2 × 3 × ... × N).',
      difficulty: 'easy',
      template: `function factorial(n) {
  // Ваш код здесь
  
}`,
      tests: [
        { input: 5, expected: 120 },
        { input: 0, expected: 1 },
        { input: 1, expected: 1 },
        { input: 6, expected: 720 }
      ],
      hint: 'Используйте цикл или рекурсию. Факториал 0 равен 1.'
    },
    {
      id: 6,
      title: 'Поиск максимума',
      description: 'Напишите функцию, которая находит максимальный элемент в массиве.',
      difficulty: 'easy',
      template: `function findMax(arr) {
  // Ваш код здесь
  
}`,
      tests: [
        { input: [1, 5, 3, 9, 2], expected: 9 },
        { input: [-10, -5, -20], expected: -5 },
        { input: [42], expected: 42 }
      ],
      hint: 'Переберите массив и отслеживайте максимальное найденное значение.'
    }
  ];

  const difficultyColors = {
    easy: 'bg-accent',
    medium: 'bg-primary',
    hard: 'bg-secondary'
  };

  const difficultyNames = {
    easy: 'Лёгкий',
    medium: 'Средний',
    hard: 'Сложный'
  };

  const selectTask = (task: Task) => {
    setSelectedTask(task);
    setCode(task.template);
    setResults([]);
    setShowHint(false);
  };

  const runTests = () => {
    if (!selectedTask) return;

    const testResults: TestResult[] = [];

    try {
      const wrappedCode = `
        ${code}
        return ${selectedTask.title.includes('Сумма') ? 'sumArray' : 
                 selectedTask.title.includes('Простые') ? 'findPrimes' :
                 selectedTask.title.includes('Сортировка') ? 'sortArray' :
                 selectedTask.title.includes('Палиндром') ? 'isPalindrome' :
                 selectedTask.title.includes('Факториал') ? 'factorial' :
                 'findMax'};
      `;

      const func = new Function(wrappedCode)();

      for (const test of selectedTask.tests) {
        try {
          const actual = func(test.input);
          const passed = JSON.stringify(actual) === JSON.stringify(test.expected);
          
          testResults.push({
            passed,
            input: test.input,
            expected: test.expected,
            actual
          });
        } catch (err) {
          testResults.push({
            passed: false,
            input: test.input,
            expected: test.expected,
            actual: 'Ошибка выполнения'
          });
        }
      }

      setResults(testResults);

      const allPassed = testResults.every(r => r.passed);
      if (allPassed && !completedTasks.includes(selectedTask.id)) {
        setCompletedTasks([...completedTasks, selectedTask.id]);
      }
    } catch (err) {
      setResults([{
        passed: false,
        input: 'N/A',
        expected: 'N/A',
        actual: 'Ошибка компиляции кода'
      }]);
    }
  };

  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  const progress = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
      <Card className="bg-slate-900/50 border-slate-700 shadow-xl h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-slate-100">
            <Icon name="ListChecks" size={20} className="text-accent" />
            Список заданий
          </CardTitle>
          <CardDescription className="text-slate-400">
            Выполнено: {completedTasks.length} из {tasks.length}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => selectTask(task)}
              className={cn(
                "w-full text-left p-4 rounded-lg transition-all hover:bg-slate-800 border-2",
                selectedTask?.id === task.id 
                  ? "bg-primary/20 border-primary" 
                  : "bg-slate-800/50 border-transparent"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <p className={cn(
                  "font-semibold text-sm",
                  selectedTask?.id === task.id ? "text-primary" : "text-slate-300"
                )}>
                  {task.title}
                </p>
                {completedTasks.includes(task.id) && (
                  <Icon name="CheckCircle2" size={16} className="text-accent" />
                )}
              </div>
              <Badge className={cn(difficultyColors[task.difficulty], "text-xs text-slate-900")}>
                {difficultyNames[task.difficulty]}
              </Badge>
            </button>
          ))}
        </CardContent>
      </Card>

      {selectedTask ? (
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-slate-100">{selectedTask.title}</CardTitle>
                <Badge className={cn(difficultyColors[selectedTask.difficulty], "text-slate-900")}>
                  {difficultyNames[selectedTask.difficulty]}
                </Badge>
              </div>
              <CardDescription className="text-slate-400 text-base">
                {selectedTask.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono text-sm bg-slate-950 border-slate-700 text-slate-100 min-h-[300px] resize-none"
              />

              <div className="flex gap-2">
                <Button onClick={runTests} className="flex-1 h-12" size="lg">
                  <Icon name="Play" size={20} className="mr-2" />
                  Запустить тесты
                </Button>
                <Button 
                  onClick={() => setShowHint(!showHint)} 
                  variant="outline"
                  className="h-12"
                >
                  <Icon name="Lightbulb" size={20} className="mr-2" />
                  {showHint ? 'Скрыть' : 'Подсказка'}
                </Button>
              </div>

              {showHint && (
                <Alert className="bg-primary/10 border-primary/30">
                  <Icon name="Info" size={18} />
                  <AlertDescription className="text-slate-300">
                    💡 {selectedTask.hint}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {results.length > 0 && (
            <Card className="bg-slate-900/50 border-slate-700 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-slate-100">
                  <Icon name="TestTube" size={20} className="text-secondary" />
                  Результаты тестирования
                </CardTitle>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">
                      Пройдено тестов: {passedTests} из {totalTests}
                    </span>
                    <span className={cn(
                      "font-semibold",
                      progress === 100 ? "text-accent" : "text-primary"
                    )}>
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {results.map((result, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-4 rounded-lg border-2",
                      result.passed 
                        ? "bg-accent/10 border-accent/30" 
                        : "bg-destructive/10 border-destructive/30"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-300">
                        Тест {idx + 1}
                      </span>
                      {result.passed ? (
                        <Badge className="bg-accent text-slate-900">
                          <Icon name="Check" size={14} className="mr-1" />
                          Пройден
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <Icon name="X" size={14} className="mr-1" />
                          Провален
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1 text-sm font-mono">
                      <div className="text-slate-400">
                        Входные данные: <span className="text-slate-300">{JSON.stringify(result.input)}</span>
                      </div>
                      <div className="text-slate-400">
                        Ожидается: <span className="text-accent">{JSON.stringify(result.expected)}</span>
                      </div>
                      <div className="text-slate-400">
                        Получено: <span className={result.passed ? "text-accent" : "text-destructive"}>
                          {JSON.stringify(result.actual)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card className="bg-slate-900/50 border-slate-700 shadow-xl">
          <CardContent className="flex flex-col items-center justify-center min-h-[500px]">
            <Icon name="Code2" size={64} className="text-slate-700 mb-4" />
            <p className="text-xl text-slate-500">Выберите задание для начала</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CodingTrainer;
