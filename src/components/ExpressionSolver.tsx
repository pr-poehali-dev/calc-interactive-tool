import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface TruthRow {
  variables: Record<string, number>;
  result: number;
}

const ExpressionSolver = () => {
  const [expression, setExpression] = useState('');
  const [truthTable, setTruthTable] = useState<TruthRow[]>([]);
  const [variables, setVariables] = useState<string[]>([]);
  const [error, setError] = useState('');

  const parseExpression = (expr: string): string[] => {
    const normalized = expr
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/and/g, '&')
      .replace(/or/g, '|')
      .replace(/not/g, '!')
      .replace(/\^/g, '^');

    const varPattern = /[a-z]/gi;
    const matches = normalized.match(varPattern);
    return matches ? Array.from(new Set(matches)) : [];
  };

  const evaluateExpression = (expr: string, values: Record<string, number>): number => {
    let normalized = expr
      .toLowerCase()
      .replace(/\s+/g, '');

    Object.entries(values).forEach(([variable, value]) => {
      const regex = new RegExp(variable, 'g');
      normalized = normalized.replace(regex, value.toString());
    });

    normalized = normalized
      .replace(/and/g, '&&')
      .replace(/or/g, '||')
      .replace(/not/g, '!')
      .replace(/\^/g, '!=');

    try {
      const result = eval(normalized);
      return result ? 1 : 0;
    } catch {
      throw new Error('Ошибка вычисления');
    }
  };

  const generateCombinations = (vars: string[]): Record<string, number>[] => {
    const combinations: Record<string, number>[] = [];
    const count = Math.pow(2, vars.length);

    for (let i = 0; i < count; i++) {
      const combination: Record<string, number> = {};
      vars.forEach((variable, index) => {
        combination[variable] = (i >> (vars.length - 1 - index)) & 1;
      });
      combinations.push(combination);
    }

    return combinations;
  };

  const handleSolve = () => {
    setError('');
    setTruthTable([]);
    setVariables([]);

    if (!expression.trim()) {
      setError('Введите логическое выражение');
      return;
    }

    try {
      const vars = parseExpression(expression);
      
      if (vars.length === 0) {
        setError('Не найдены переменные в выражении');
        return;
      }

      if (vars.length > 4) {
        setError('Максимум 4 переменные поддерживаются');
        return;
      }

      const combinations = generateCombinations(vars);
      const table: TruthRow[] = combinations.map(combo => ({
        variables: combo,
        result: evaluateExpression(expression, combo),
      }));

      setVariables(vars);
      setTruthTable(table);
    } catch (err) {
      setError('Ошибка разбора выражения. Используйте переменные (A, B, C) и операторы (and, or, not, ^)');
    }
  };

  const getExpressionPreview = () => {
    return expression
      .toLowerCase()
      .replace(/and/g, '∧')
      .replace(/or/g, '∨')
      .replace(/not/g, '¬')
      .replace(/\^/g, '⊕');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="bg-slate-900/50 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-slate-100">
            <Icon name="FileCode" size={24} className="text-accent" />
            Ввод логического выражения
          </CardTitle>
          <CardDescription className="text-slate-400">
            Введите булево выражение с переменными A, B, C, D
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-slate-300">Логическое выражение</Label>
            <Input
              placeholder="Например: (A and B) or not C"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSolve()}
              className="bg-slate-800 border-slate-600 text-slate-100 text-lg h-12 font-mono"
            />
          </div>

          {expression && (
            <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
              <p className="text-sm text-slate-400 mb-1">Предпросмотр:</p>
              <p className="text-xl font-mono text-secondary">{getExpressionPreview()}</p>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-300">Поддерживаемые операторы:</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-800 rounded border border-slate-600">
                <p className="font-mono text-accent">and</p>
                <p className="text-xs text-slate-400">Логическое И (∧)</p>
              </div>
              <div className="p-3 bg-slate-800 rounded border border-slate-600">
                <p className="font-mono text-accent">or</p>
                <p className="text-xs text-slate-400">Логическое ИЛИ (∨)</p>
              </div>
              <div className="p-3 bg-slate-800 rounded border border-slate-600">
                <p className="font-mono text-accent">not</p>
                <p className="text-xs text-slate-400">Отрицание (¬)</p>
              </div>
              <div className="p-3 bg-slate-800 rounded border border-slate-600">
                <p className="font-mono text-accent">^</p>
                <p className="text-xs text-slate-400">XOR (⊕)</p>
              </div>
            </div>
          </div>

          <Button onClick={handleSolve} className="w-full h-12 text-base" size="lg">
            <Icon name="Play" size={20} className="mr-2" />
            Построить таблицу истинности
          </Button>

          {error && (
            <Alert variant="destructive">
              <Icon name="AlertCircle" size={18} />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-slate-100">
            <Icon name="Table2" size={24} className="text-primary" />
            Результат
          </CardTitle>
          <CardDescription className="text-slate-400">
            Таблица истинности для введённого выражения
          </CardDescription>
        </CardHeader>
        <CardContent>
          {truthTable.length > 0 ? (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-lg border border-slate-600">
                <table className="w-full">
                  <thead className="bg-slate-800">
                    <tr>
                      {variables.map((variable) => (
                        <th key={variable} className="px-4 py-3 text-left text-sm font-semibold text-slate-300 uppercase">
                          {variable}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Результат</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {truthTable.map((row, idx) => (
                      <tr key={idx} className="bg-slate-800/50 hover:bg-slate-800 transition-colors">
                        {variables.map((variable) => (
                          <td key={variable} className="px-4 py-3">
                            <div className={cn(
                              "inline-flex items-center justify-center w-8 h-8 rounded font-mono font-bold",
                              row.variables[variable] === 1 
                                ? "bg-accent text-slate-900" 
                                : "bg-slate-700 text-slate-400"
                            )}>
                              {row.variables[variable]}
                            </div>
                          </td>
                        ))}
                        <td className="px-4 py-3">
                          <div className={cn(
                            "inline-flex items-center justify-center w-8 h-8 rounded font-mono font-bold",
                            row.result === 1 
                              ? "bg-primary text-white" 
                              : "bg-slate-700 text-slate-400"
                          )}>
                            {row.result}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <p className="text-sm text-slate-300">
                  <Icon name="Info" size={16} className="inline mr-2" />
                  Найдено переменных: <span className="font-bold text-primary">{variables.join(', ')}</span>
                  <br />
                  Всего комбинаций: <span className="font-bold text-primary">{truthTable.length}</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-500">
              <Icon name="FileQuestion" size={64} className="mb-4 opacity-50" />
              <p className="text-lg">Введите выражение и нажмите кнопку</p>
              <p className="text-sm mt-2">для построения таблицы истинности</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpressionSolver;
