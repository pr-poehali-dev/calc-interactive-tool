import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Base = 2 | 8 | 10 | 16;

const NumberConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [fromBase, setFromBase] = useState<Base>(10);
  const [toBase, setToBase] = useState<Base>(2);
  const [result, setResult] = useState('');
  const [steps, setSteps] = useState<string[]>([]);
  const [error, setError] = useState('');

  const baseNames: Record<Base, string> = {
    2: 'Двоичная',
    8: 'Восьмеричная',
    10: 'Десятичная',
    16: 'Шестнадцатеричная',
  };

  const validateInput = (value: string, base: Base): boolean => {
    if (!value) return false;
    const validChars: Record<Base, RegExp> = {
      2: /^[01]+$/,
      8: /^[0-7]+$/,
      10: /^[0-9]+$/,
      16: /^[0-9A-Fa-f]+$/,
    };
    return validChars[base].test(value);
  };

  const convertToDecimal = (value: string, base: Base): number => {
    return parseInt(value, base);
  };

  const convertFromDecimal = (decimal: number, base: Base): { result: string; steps: string[] } => {
    if (base === 10) {
      return { result: decimal.toString(), steps: [`Результат: ${decimal}`] };
    }

    const steps: string[] = [];
    let num = decimal;
    let result = '';

    steps.push(`Исходное число: ${decimal}₁₀`);
    steps.push(`Переводим в систему счисления с основанием ${base}:`);

    while (num > 0) {
      const remainder = num % base;
      const quotient = Math.floor(num / base);
      const remainderStr = remainder < 10 ? remainder.toString() : String.fromCharCode(65 + remainder - 10);
      
      steps.push(`${num} ÷ ${base} = ${quotient}, остаток: ${remainderStr}`);
      result = remainderStr + result;
      num = quotient;
    }

    steps.push(`Читаем остатки снизу вверх: ${result}`);
    return { result: result || '0', steps };
  };

  const handleConvert = () => {
    setError('');
    setSteps([]);
    setResult('');

    if (!validateInput(inputValue, fromBase)) {
      setError(`Некорректное число для ${baseNames[fromBase].toLowerCase()} системы счисления`);
      return;
    }

    const decimal = convertToDecimal(inputValue.toUpperCase(), fromBase);
    const conversion = convertFromDecimal(decimal, toBase);
    
    setResult(conversion.result);
    setSteps(conversion.steps);
  };

  return (
    <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Icon name="RefreshCw" size={24} className="text-primary" />
          Перевод чисел между системами счисления
        </CardTitle>
        <CardDescription>
          Введите число и выберите системы счисления для перевода
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="input-number">Исходное число</Label>
            <Input
              id="input-number"
              placeholder="Введите число"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="text-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Из системы</Label>
              <Select value={fromBase.toString()} onValueChange={(v) => setFromBase(Number(v) as Base)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 (Двоичная)</SelectItem>
                  <SelectItem value="8">8 (Восьмеричная)</SelectItem>
                  <SelectItem value="10">10 (Десятичная)</SelectItem>
                  <SelectItem value="16">16 (Шестнадцатеричная)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>В систему</Label>
              <Select value={toBase.toString()} onValueChange={(v) => setToBase(Number(v) as Base)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 (Двоичная)</SelectItem>
                  <SelectItem value="8">8 (Восьмеричная)</SelectItem>
                  <SelectItem value="10">10 (Десятичная)</SelectItem>
                  <SelectItem value="16">16 (Шестнадцатеричная)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button onClick={handleConvert} className="w-full h-12 text-base" size="lg">
          <Icon name="ArrowRight" size={20} className="mr-2" />
          Перевести
        </Button>

        {error && (
          <Alert variant="destructive">
            <Icon name="AlertCircle" size={18} />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-6 bg-primary/5 rounded-lg border-2 border-primary/20">
              <p className="text-sm text-muted-foreground mb-2">Результат:</p>
              <p className="text-3xl font-bold text-primary">{result}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {inputValue}₍{fromBase}₎ = {result}₍{toBase}₎
              </p>
            </div>

            {steps.length > 0 && (
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Icon name="List" size={20} />
                    Пошаговое решение
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2 list-decimal list-inside">
                    {steps.map((step, index) => (
                      <li key={index} className="text-sm text-foreground/90">
                        {step}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NumberConverter;
