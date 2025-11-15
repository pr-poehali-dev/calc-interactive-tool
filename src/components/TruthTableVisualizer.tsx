import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

type LogicGate = 'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR' | 'IMPLY';

interface TruthRow {
  inputs: number[];
  output: number;
}

const TruthTableVisualizer = () => {
  const [selectedGate, setSelectedGate] = useState<LogicGate>('AND');
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const gateInfo: Record<LogicGate, { name: string; description: string; symbol: string }> = {
    AND: { name: 'И (AND)', description: 'Истина только если все входы истинны', symbol: '∧' },
    OR: { name: 'ИЛИ (OR)', description: 'Истина если хотя бы один вход истинен', symbol: '∨' },
    NOT: { name: 'НЕ (NOT)', description: 'Инверсия входного значения', symbol: '¬' },
    XOR: { name: 'Исключающее ИЛИ (XOR)', description: 'Истина если входы различны', symbol: '⊕' },
    NAND: { name: 'И-НЕ (NAND)', description: 'Инверсия AND', symbol: '↑' },
    NOR: { name: 'ИЛИ-НЕ (NOR)', description: 'Инверсия OR', symbol: '↓' },
    IMPLY: { name: 'Импликация (A→B)', description: 'Ложь только если A истинно, а B ложно', symbol: '→' },
  };

  const evaluateGate = (gate: LogicGate, inputs: number[]): number => {
    const [a, b] = inputs;
    switch (gate) {
      case 'AND': return a && b ? 1 : 0;
      case 'OR': return a || b ? 1 : 0;
      case 'NOT': return a ? 0 : 1;
      case 'XOR': return a !== b ? 1 : 0;
      case 'NAND': return a && b ? 0 : 1;
      case 'NOR': return a || b ? 0 : 1;
      case 'IMPLY': return !a || b ? 1 : 0;
      default: return 0;
    }
  };

  const generateTruthTable = (gate: LogicGate): TruthRow[] => {
    if (gate === 'NOT') {
      return [
        { inputs: [0], output: evaluateGate(gate, [0]) },
        { inputs: [1], output: evaluateGate(gate, [1]) },
      ];
    }
    
    return [
      { inputs: [0, 0], output: evaluateGate(gate, [0, 0]) },
      { inputs: [0, 1], output: evaluateGate(gate, [0, 1]) },
      { inputs: [1, 0], output: evaluateGate(gate, [1, 0]) },
      { inputs: [1, 1], output: evaluateGate(gate, [1, 1]) },
    ];
  };

  const truthTable = generateTruthTable(selectedGate);
  const isUnary = selectedGate === 'NOT';

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="bg-slate-900/50 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-slate-100">
            <Icon name="Table" size={24} className="text-primary" />
            Таблица истинности
          </CardTitle>
          <CardDescription className="text-slate-400">
            Выберите логическую функцию для отображения таблицы истинности
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-slate-300">Логическая функция</Label>
            <Select value={selectedGate} onValueChange={(v) => setSelectedGate(v as LogicGate)}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {Object.entries(gateInfo).map(([key, info]) => (
                  <SelectItem key={key} value={key} className="text-slate-100">
                    {info.name} ({info.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-primary">{gateInfo[selectedGate].name}</span>
              <br />
              {gateInfo[selectedGate].description}
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-600">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  {!isUnary && <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">A</th>}
                  {!isUnary && <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">B</th>}
                  {isUnary && <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">A</th>}
                  <th className="px-4 py-3 text-left text-sm font-semibold text-primary">Выход</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {truthTable.map((row, idx) => (
                  <tr
                    key={idx}
                    onMouseEnter={() => setHoveredRow(idx)}
                    onMouseLeave={() => setHoveredRow(null)}
                    className={cn(
                      "transition-colors cursor-pointer",
                      hoveredRow === idx ? "bg-primary/20" : "bg-slate-800/50 hover:bg-slate-800"
                    )}
                  >
                    {row.inputs.map((input, i) => (
                      <td key={i} className="px-4 py-3">
                        <div className={cn(
                          "inline-flex items-center justify-center w-8 h-8 rounded font-mono font-bold",
                          input === 1 
                            ? "bg-accent text-slate-900" 
                            : "bg-slate-700 text-slate-400"
                        )}>
                          {input}
                        </div>
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className={cn(
                        "inline-flex items-center justify-center w-8 h-8 rounded font-mono font-bold",
                        row.output === 1 
                          ? "bg-primary text-white" 
                          : "bg-slate-700 text-slate-400"
                      )}>
                        {row.output}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-slate-100">
            <Icon name="Zap" size={24} className="text-secondary" />
            Визуализация элемента
          </CardTitle>
          <CardDescription className="text-slate-400">
            Схематичное изображение логического элемента
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center min-h-[400px] p-8">
            <div className="relative">
              {isUnary ? (
                <div className="flex flex-col items-center gap-4">
                  <div className={cn(
                    "w-4 h-4 rounded-full transition-all",
                    hoveredRow !== null && truthTable[hoveredRow].inputs[0] === 1
                      ? "bg-accent shadow-lg shadow-accent/50"
                      : "bg-slate-600"
                  )} />
                  <div className={cn(
                    "w-1 h-16 transition-all",
                    hoveredRow !== null && truthTable[hoveredRow].inputs[0] === 1
                      ? "bg-accent shadow-lg shadow-accent/50"
                      : "bg-slate-600"
                  )} />
                  <div className="relative w-32 h-32 bg-gradient-to-br from-secondary to-secondary/70 rounded-lg flex items-center justify-center shadow-2xl border-2 border-secondary/50">
                    <span className="text-4xl font-bold text-white">{gateInfo[selectedGate].symbol}</span>
                  </div>
                  <div className={cn(
                    "w-1 h-16 transition-all",
                    hoveredRow !== null && truthTable[hoveredRow].output === 1
                      ? "bg-primary shadow-lg shadow-primary/50"
                      : "bg-slate-600"
                  )} />
                  <div className={cn(
                    "w-4 h-4 rounded-full transition-all",
                    hoveredRow !== null && truthTable[hoveredRow].output === 1
                      ? "bg-primary shadow-lg shadow-primary/50"
                      : "bg-slate-600"
                  )} />
                </div>
              ) : (
                <div className="flex items-center gap-8">
                  <div className="flex flex-col gap-16">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-4 h-4 rounded-full transition-all",
                        hoveredRow !== null && truthTable[hoveredRow].inputs[0] === 1
                          ? "bg-accent shadow-lg shadow-accent/50"
                          : "bg-slate-600"
                      )} />
                      <div className={cn(
                        "w-20 h-1 transition-all",
                        hoveredRow !== null && truthTable[hoveredRow].inputs[0] === 1
                          ? "bg-accent shadow-lg shadow-accent/50"
                          : "bg-slate-600"
                      )} />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-4 h-4 rounded-full transition-all",
                        hoveredRow !== null && truthTable[hoveredRow].inputs[1] === 1
                          ? "bg-accent shadow-lg shadow-accent/50"
                          : "bg-slate-600"
                      )} />
                      <div className={cn(
                        "w-20 h-1 transition-all",
                        hoveredRow !== null && truthTable[hoveredRow].inputs[1] === 1
                          ? "bg-accent shadow-lg shadow-accent/50"
                          : "bg-slate-600"
                      )} />
                    </div>
                  </div>
                  
                  <div className="relative w-40 h-40 bg-gradient-to-br from-secondary to-secondary/70 rounded-lg flex items-center justify-center shadow-2xl border-2 border-secondary/50">
                    <span className="text-5xl font-bold text-white">{gateInfo[selectedGate].symbol}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-20 h-1 transition-all",
                      hoveredRow !== null && truthTable[hoveredRow].output === 1
                        ? "bg-primary shadow-lg shadow-primary/50"
                        : "bg-slate-600"
                    )} />
                    <div className={cn(
                      "w-4 h-4 rounded-full transition-all",
                      hoveredRow !== null && truthTable[hoveredRow].output === 1
                        ? "bg-primary shadow-lg shadow-primary/50"
                        : "bg-slate-600"
                    )} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TruthTableVisualizer;
