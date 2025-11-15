import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

type Base = 2 | 8 | 10 | 16;

interface Task {
  number: string;
  fromBase: Base;
  toBase: Base;
  correctAnswer: string;
}

const PracticeGenerator = () => {
  const [task, setTask] = useState<Task | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const baseNames: Record<Base, string> = {
    2: 'двоичной',
    8: 'восьмеричной',
    10: 'десятичной',
    16: 'шестнадцатеричной',
  };

  const generateTask = () => {
    const bases: Base[] = [2, 8, 10, 16];
    const fromBase = bases[Math.floor(Math.random() * bases.length)];
    let toBase = bases[Math.floor(Math.random() * bases.length)];
    
    while (toBase === fromBase) {
      toBase = bases[Math.floor(Math.random() * bases.length)];
    }

    const maxValue = fromBase === 2 ? 255 : fromBase === 8 ? 512 : fromBase === 10 ? 1000 : 256;
    const decimalNumber = Math.floor(Math.random() * maxValue) + 1;
    
    const number = decimalNumber.toString(fromBase).toUpperCase();
    const correctAnswer = decimalNumber.toString(toBase).toUpperCase();

    setTask({ number, fromBase, toBase, correctAnswer });
    setUserAnswer('');
    setFeedback(null);
  };

  const handleCheck = () => {
    if (!task || !userAnswer) return;

    const isCorrect = userAnswer.toUpperCase() === task.correctAnswer;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setTotalAttempts(totalAttempts + 1);
    
    if (isCorrect) {
      setCorrectCount(correctCount + 1);
    }
  };

  const handleNext = () => {
    generateTask();
  };

  useEffect(() => {
    generateTask();
  }, []);

  if (!task) return null;

  const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 0;

  return (
    <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Icon name="Trophy" size={24} className="text-accent" />
              Генератор практических заданий
            </CardTitle>
            <CardDescription>
              Тренируйтесь в переводе чисел между системами счисления
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="px-4 py-2 text-base">
              <Icon name="Target" size={16} className="mr-2" />
              {correctCount} / {totalAttempts}
            </Badge>
            {totalAttempts > 0 && (
              <Badge 
                variant={accuracy >= 70 ? 'default' : 'secondary'} 
                className="px-4 py-2 text-base"
              >
                <Icon name="Percent" size={16} className="mr-2" />
                {accuracy}%
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-8 bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl border-2 border-accent/20">
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">
              Переведите число из {baseNames[task.fromBase]} системы в {baseNames[task.toBase]}:
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-5xl font-bold text-accent font-mono">
                {task.number}
              </div>
              <div className="text-3xl text-muted-foreground">
                ₍{task.fromBase}₎
              </div>
            </div>
            <Icon name="ArrowDown" size={32} className="mx-auto text-primary animate-bounce" />
            <div className="text-3xl text-muted-foreground">
              ? ₍{task.toBase}₎
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="answer">Ваш ответ</Label>
          <Input
            id="answer"
            placeholder="Введите ответ"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
            className="text-2xl text-center font-mono h-14"
            disabled={feedback !== null}
          />
        </div>

        {feedback === null ? (
          <Button onClick={handleCheck} className="w-full h-12 text-base" size="lg" disabled={!userAnswer}>
            <Icon name="CheckCircle" size={20} className="mr-2" />
            Проверить
          </Button>
        ) : (
          <div className="space-y-4">
            <Alert variant={feedback === 'correct' ? 'default' : 'destructive'} className="border-2">
              <Icon name={feedback === 'correct' ? 'CheckCircle2' : 'XCircle'} size={18} />
              <AlertDescription className="text-base">
                {feedback === 'correct' ? (
                  <span className="font-semibold">✓ Верно! Отличная работа!</span>
                ) : (
                  <span>
                    ✗ Неверно. Правильный ответ: <span className="font-bold">{task.correctAnswer}</span>
                  </span>
                )}
              </AlertDescription>
            </Alert>
            <Button onClick={handleNext} className="w-full h-12 text-base" size="lg">
              <Icon name="ArrowRight" size={20} className="mr-2" />
              Следующее задание
            </Button>
          </div>
        )}

        {totalAttempts >= 5 && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Прогресс тренировки:</span>
              <span className="font-semibold">{correctCount} правильных из {totalAttempts}</span>
            </div>
            <div className="mt-2 w-full bg-muted rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: `${accuracy}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PracticeGenerator;
