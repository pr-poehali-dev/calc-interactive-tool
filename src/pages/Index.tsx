import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CodeHandbook from '@/components/CodeHandbook';
import CodeEditor from '@/components/CodeEditor';
import CodingTrainer from '@/components/CodingTrainer';
import Icon from '@/components/ui/icon';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-3 animate-fade-in">
          <div className="flex items-center justify-center gap-3">
            <Icon name="Code2" size={56} className="text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Основы программирования
            </h1>
          </div>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Интерактивный справочник и песочница для изучения Python, JavaScript и C++ с практическими заданиями
          </p>
        </div>

        <Tabs defaultValue="handbook" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-16 p-1 bg-slate-900/50 border border-slate-700">
            <TabsTrigger value="handbook" className="text-base data-[state=active]:bg-primary/20">
              <Icon name="BookOpen" size={20} className="mr-2" />
              Справочник
            </TabsTrigger>
            <TabsTrigger value="editor" className="text-base data-[state=active]:bg-secondary/20">
              <Icon name="Code" size={20} className="mr-2" />
              Редактор кода
            </TabsTrigger>
            <TabsTrigger value="trainer" className="text-base data-[state=active]:bg-accent/20">
              <Icon name="Trophy" size={20} className="mr-2" />
              Тренажёр
            </TabsTrigger>
          </TabsList>

          <TabsContent value="handbook" className="mt-6 animate-fade-in">
            <CodeHandbook />
          </TabsContent>

          <TabsContent value="editor" className="mt-6 animate-fade-in">
            <CodeEditor />
          </TabsContent>

          <TabsContent value="trainer" className="mt-6 animate-fade-in">
            <CodingTrainer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;