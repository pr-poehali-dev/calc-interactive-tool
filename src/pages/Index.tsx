import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TruthTableVisualizer from '@/components/TruthTableVisualizer';
import LogicCircuitBuilder from '@/components/LogicCircuitBuilder';
import ExpressionSolver from '@/components/ExpressionSolver';
import Icon from '@/components/ui/icon';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-3 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <Icon name="Cpu" size={56} className="text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Визуализация булевой алгебры
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Интерактивный инструмент для изучения логических функций, построения схем и анализа булевых выражений
          </p>
        </div>

        <Tabs defaultValue="truth-table" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-16 p-1 bg-slate-900/50 border border-slate-700">
            <TabsTrigger value="truth-table" className="text-base data-[state=active]:bg-primary/20">
              <Icon name="Table" size={20} className="mr-2" />
              Таблицы истинности
            </TabsTrigger>
            <TabsTrigger value="circuit" className="text-base data-[state=active]:bg-secondary/20">
              <Icon name="Boxes" size={20} className="mr-2" />
              Конструктор схем
            </TabsTrigger>
            <TabsTrigger value="solver" className="text-base data-[state=active]:bg-accent/20">
              <Icon name="FileCode" size={20} className="mr-2" />
              Решатель выражений
            </TabsTrigger>
          </TabsList>

          <TabsContent value="truth-table" className="mt-6 animate-fade-in">
            <TruthTableVisualizer />
          </TabsContent>

          <TabsContent value="circuit" className="mt-6 animate-fade-in">
            <LogicCircuitBuilder />
          </TabsContent>

          <TabsContent value="solver" className="mt-6 animate-fade-in">
            <ExpressionSolver />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;