import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

type GateType = 'AND' | 'OR' | 'NOT';
type ElementType = 'gate' | 'input' | 'output';

interface CircuitElement {
  id: string;
  type: ElementType;
  gateType?: GateType;
  x: number;
  y: number;
  value?: boolean;
}

interface Wire {
  from: string;
  to: string;
}

const LogicCircuitBuilder = () => {
  const [elements, setElements] = useState<CircuitElement[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [selectedTool, setSelectedTool] = useState<'input' | 'output' | GateType | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const addElement = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedTool) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newElement: CircuitElement = {
      id: `elem-${Date.now()}`,
      type: selectedTool === 'input' || selectedTool === 'output' ? selectedTool : 'gate',
      gateType: selectedTool !== 'input' && selectedTool !== 'output' ? selectedTool : undefined,
      x,
      y,
      value: selectedTool === 'input' ? false : undefined,
    };

    setElements([...elements, newElement]);
  };

  const toggleInput = (id: string) => {
    setElements(elements.map(el => 
      el.id === id && el.type === 'input' 
        ? { ...el, value: !el.value }
        : el
    ));
  };

  const handleElementClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const element = elements.find(el => el.id === id);
    
    if (element?.type === 'input') {
      toggleInput(id);
      return;
    }

    if (selectedElement === null) {
      setSelectedElement(id);
    } else if (selectedElement !== id) {
      setWires([...wires, { from: selectedElement, to: id }]);
      setSelectedElement(null);
    } else {
      setSelectedElement(null);
    }
  };

  const evaluateOutput = (elementId: string): boolean => {
    const element = elements.find(el => el.id === elementId);
    if (!element) return false;
    if (element.type === 'input') return element.value || false;

    const inputWires = wires.filter(w => w.to === elementId);
    const inputValues = inputWires.map(w => evaluateOutput(w.from));

    if (element.gateType === 'AND') {
      return inputValues.length > 0 && inputValues.every(v => v);
    } else if (element.gateType === 'OR') {
      return inputValues.some(v => v);
    } else if (element.gateType === 'NOT') {
      return inputValues.length > 0 ? !inputValues[0] : false;
    }

    return false;
  };

  const clearCanvas = () => {
    setElements([]);
    setWires([]);
    setSelectedElement(null);
  };

  const getGateIcon = (gateType?: GateType) => {
    if (gateType === 'AND') return '∧';
    if (gateType === 'OR') return '∨';
    if (gateType === 'NOT') return '¬';
    return '';
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/50 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-slate-100">
            <Icon name="Boxes" size={24} className="text-secondary" />
            Палитра элементов
          </CardTitle>
          <CardDescription className="text-slate-400">
            Выберите элемент и кликните на рабочую область для размещения
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedTool === 'input' ? 'default' : 'outline'}
              onClick={() => setSelectedTool('input')}
              className="h-16 px-6"
            >
              <Icon name="ToggleLeft" size={20} className="mr-2" />
              Входной сигнал
            </Button>
            <Button
              variant={selectedTool === 'output' ? 'default' : 'outline'}
              onClick={() => setSelectedTool('output')}
              className="h-16 px-6"
            >
              <Icon name="Lightbulb" size={20} className="mr-2" />
              Выходной индикатор
            </Button>
            <Button
              variant={selectedTool === 'AND' ? 'secondary' : 'outline'}
              onClick={() => setSelectedTool('AND')}
              className="h-16 px-6"
            >
              AND (∧)
            </Button>
            <Button
              variant={selectedTool === 'OR' ? 'secondary' : 'outline'}
              onClick={() => setSelectedTool('OR')}
              className="h-16 px-6"
            >
              OR (∨)
            </Button>
            <Button
              variant={selectedTool === 'NOT' ? 'secondary' : 'outline'}
              onClick={() => setSelectedTool('NOT')}
              className="h-16 px-6"
            >
              NOT (¬)
            </Button>
            <Button
              variant="destructive"
              onClick={clearCanvas}
              className="h-16 px-6 ml-auto"
            >
              <Icon name="Trash2" size={20} className="mr-2" />
              Очистить
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-slate-100">
            <Icon name="Grid3x3" size={24} className="text-primary" />
            Рабочая область
          </CardTitle>
          <CardDescription className="text-slate-400">
            {selectedTool 
              ? 'Кликните на область для размещения элемента' 
              : 'Кликните на элементы для соединения проводами'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onClick={addElement}
            className="relative w-full h-[600px] bg-slate-950 rounded-lg border-2 border-slate-700 overflow-hidden cursor-crosshair"
            style={{
              backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          >
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {wires.map((wire, idx) => {
                const fromEl = elements.find(el => el.id === wire.from);
                const toEl = elements.find(el => el.id === wire.to);
                if (!fromEl || !toEl) return null;

                const isActive = evaluateOutput(wire.from);

                return (
                  <line
                    key={idx}
                    x1={fromEl.x + 30}
                    y1={fromEl.y + 30}
                    x2={toEl.x + 30}
                    y2={toEl.y + 30}
                    stroke={isActive ? '#0EA5E9' : '#475569'}
                    strokeWidth="3"
                    className="transition-all"
                  />
                );
              })}
            </svg>

            {elements.map((element) => {
              const isActive = element.type === 'output' 
                ? evaluateOutput(element.id)
                : element.value;

              return (
                <div
                  key={element.id}
                  onClick={(e) => handleElementClick(element.id, e)}
                  className={cn(
                    "absolute w-16 h-16 rounded-lg flex items-center justify-center cursor-pointer transition-all transform hover:scale-110",
                    selectedElement === element.id && "ring-4 ring-primary",
                    element.type === 'input' && (isActive ? "bg-accent shadow-lg shadow-accent/50" : "bg-slate-700"),
                    element.type === 'output' && (isActive ? "bg-primary shadow-lg shadow-primary/50" : "bg-slate-700"),
                    element.type === 'gate' && "bg-secondary shadow-lg"
                  )}
                  style={{
                    left: element.x - 30,
                    top: element.y - 30,
                  }}
                >
                  {element.type === 'input' && (
                    <Icon name="ToggleLeft" size={28} className="text-white" />
                  )}
                  {element.type === 'output' && (
                    <Icon name="Lightbulb" size={28} className={isActive ? "text-white" : "text-slate-500"} />
                  )}
                  {element.type === 'gate' && (
                    <span className="text-2xl font-bold text-white">
                      {getGateIcon(element.gateType)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-4 bg-slate-800 rounded-lg">
            <p className="text-sm text-slate-400">
              💡 <span className="font-semibold">Инструкция:</span> Выберите элемент из палитры → Кликните на рабочую область для размещения → 
              Кликните на элементы для соединения проводами → Кликните на входные сигналы для переключения 0/1
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogicCircuitBuilder;
