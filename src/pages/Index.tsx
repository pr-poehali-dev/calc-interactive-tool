import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NumberConverter from '@/components/NumberConverter';
import ArithmeticCalculator from '@/components/ArithmeticCalculator';
import PracticeGenerator from '@/components/PracticeGenerator';
import Icon from '@/components/ui/icon';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <Icon name="Calculator" size={48} className="text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Калькулятор систем счисления
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Интерактивный образовательный инструмент для изучения двоичной, восьмеричной, десятичной и шестнадцатеричной систем счисления
          </p>
        </div>

        <Tabs defaultValue="converter" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-14 p-1">
            <TabsTrigger value="converter" className="text-base">
              <Icon name="RefreshCw" size={18} className="mr-2" />
              Перевод чисел
            </TabsTrigger>
            <TabsTrigger value="arithmetic" className="text-base">
              <Icon name="Plus" size={18} className="mr-2" />
              Арифметика
            </TabsTrigger>
            <TabsTrigger value="practice" className="text-base">
              <Icon name="Trophy" size={18} className="mr-2" />
              Практика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="converter" className="mt-6 animate-fade-in">
            <NumberConverter />
          </TabsContent>

          <TabsContent value="arithmetic" className="mt-6 animate-fade-in">
            <ArithmeticCalculator />
          </TabsContent>

          <TabsContent value="practice" className="mt-6 animate-fade-in">
            <PracticeGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
