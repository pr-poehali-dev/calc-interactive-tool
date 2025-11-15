import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Base = 2 | 8 | 16;
type Operation = '+' | '-' | '*' | '/';

const ArithmeticCalculator = () => {
  const [base, setBase] = useState<Base>(2);
  const [operand1, setOperand1] = useState('');
  const [operand2, setOperand2] = useState('');
  const [operation, setOperation] = useState<Operation>('+');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const baseNames: Record<Base, string> = {
    2: 'Двоичная',
    8: 'Восьмеричная',
    16: 'Шестнадцатеричная',
  };

  const operationNames: Record<Operation, string> = {
    '+': 'Сложение',
    '-': 'Вычитание',
    '*': 'Умножение',
    '/': 'Деление',
  };

  const validateInput = (value: string, base: Base): boolean => {
    if (!value) return false;
    const validChars: Record<Base, RegExp> = {
      2: /^[01]+$/,
      8: /^[0-7]+$/,
      16: /^[0-9A-Fa-f]+$/,
    };
    return validChars[base].test(value);
  };

  const handleCalculate = () => {
    setError('');
    setResult('');

    if (!validateInput(operand1, base)) {
      setError(`Некорректное первое число для ${baseNames[base].toLowerCase()} системы`);
      return;
    }

    if (!validateInput(operand2, base)) {
      setError(`Некорректное второе число для ${baseNames[base].toLowerCase()} системы`);
      return;
    }

    const num1 = parseInt(operand1.toUpperCase(), base);
    const num2 = parseInt(operand2.toUpperCase(), base);

    let resultDecimal: number;
    switch (operation) {
      case '+':
        resultDecimal = num1 + num2;
        break;
      case '-':
        resultDecimal = num1 - num2;
        if (resultDecimal < 0) {
          setError('Результат отрицательный. Работа с отрицательными числами не поддерживается в данном режиме.');
          return;
        }
        break;
      case '*':
        resultDecimal = num1 * num2;
        break;
      case '/':
        if (num2 === 0) {
          setError('Деление на ноль невозможно');
          return;
        }
        resultDecimal = Math.floor(num1 / num2);
        break;
    }

    const resultInBase = resultDecimal.toString(base).toUpperCase();
    setResult(resultInBase);
  };

  const getOperationIcon = (op: Operation) => {
    const icons: Record<Operation, string> = {
      '+': 'Plus',
      '-': 'Minus',
      '*': 'X',
      '/': 'Divide',
    };
    return icons[op];
  };

  return (
    <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Icon name="Calculator" size={24} className="text-secondary" />
          Арифметические операции
        </CardTitle>
        <CardDescription>
          Выполняйте арифметические операции в различных системах счисления
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Система счисления</Label>
          <Select value={base.toString()} onValueChange={(v) => setBase(Number(v) as Base)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 (Двоичная)</SelectItem>
              <SelectItem value="8">8 (Восьмеричная)</SelectItem>
              <SelectItem value="16">16 (Шестнадцатеричная)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="operand1">Первое число</Label>
            <Input
              id="operand1"
              placeholder="Введите число"
              value={operand1}
              onChange={(e) => setOperand1(e.target.value)}
              className="text-lg font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="operand2">Второе число</Label>
            <Input
              id="operand2"
              placeholder="Введите число"
              value={operand2}
              onChange={(e) => setOperand2(e.target.value)}
              className="text-lg font-mono"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Операция</Label>
          <div className="grid grid-cols-4 gap-2">
            {(['+', '-', '*', '/'] as Operation[]).map((op) => (
              <Button
                key={op}
                variant={operation === op ? 'default' : 'outline'}
                onClick={() => setOperation(op)}
                className="h-14"
              >
                <Icon name={getOperationIcon(op)} size={20} className="mr-2" />
                {operationNames[op]}
              </Button>
            ))}
          </div>
        </div>

        <Button onClick={handleCalculate} className="w-full h-12 text-base" size="lg">
          <Icon name="Equal" size={20} className="mr-2" />
          Решить
        </Button>

        {error && (
          <Alert variant="destructive">
            <Icon name="AlertCircle" size={18} />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="p-6 bg-secondary/5 rounded-lg border-2 border-secondary/20 animate-fade-in">
            <p className="text-sm text-muted-foreground mb-2">Результат:</p>
            <p className="text-4xl font-bold text-secondary font-mono">{result}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {operand1} {operation} {operand2} = {result} (в {baseNames[base].toLowerCase()} системе)
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ArithmeticCalculator;
