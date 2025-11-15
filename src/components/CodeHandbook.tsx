import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

type Topic = 'conditions' | 'loops' | 'arrays' | 'strings';
type Language = 'python' | 'javascript' | 'cpp';

interface TopicData {
  title: string;
  theory: string;
  flowchart: string;
  examples: Record<Language, string>;
}

const CodeHandbook = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic>('conditions');

  const topics: Record<Topic, TopicData> = {
    conditions: {
      title: 'Условные конструкции',
      theory: 'Условные операторы позволяют выполнять различные блоки кода в зависимости от истинности условия. Основные операторы: if (если), else (иначе), elif/else if (иначе если).',
      flowchart: `
        ┌─────────────┐
        │   Начало    │
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │  Условие?   │
        └──┬───────┬──┘
           │       │
        Да │       │ Нет
           │       │
      ┌────▼───┐ ┌─▼────┐
      │Блок 1  │ │Блок 2│
      └────┬───┘ └─┬────┘
           │       │
        ┌──▼───────▼──┐
        │    Конец    │
        └─────────────┘
      `,
      examples: {
        python: `# Python
x = 10

if x > 5:
    print("Больше 5")
elif x == 5:
    print("Равно 5")
else:
    print("Меньше 5")

# Тернарный оператор
result = "Да" if x > 5 else "Нет"`,
        javascript: `// JavaScript
const x = 10;

if (x > 5) {
    console.log("Больше 5");
} else if (x === 5) {
    console.log("Равно 5");
} else {
    console.log("Меньше 5");
}

// Тернарный оператор
const result = x > 5 ? "Да" : "Нет";`,
        cpp: `// C++
#include <iostream>
using namespace std;

int main() {
    int x = 10;
    
    if (x > 5) {
        cout << "Больше 5" << endl;
    } else if (x == 5) {
        cout << "Равно 5" << endl;
    } else {
        cout << "Меньше 5" << endl;
    }
    
    return 0;
}`
      }
    },
    loops: {
      title: 'Циклы',
      theory: 'Циклы позволяют многократно выполнять блок кода. Основные типы: for (с известным числом итераций), while (пока условие истинно), do-while (выполнить хотя бы раз).',
      flowchart: `
        ┌─────────────┐
        │   Начало    │
        └──────┬──────┘
               │
        ┌──────▼──────┐
        │  Условие?   │◄─┐
        └──┬───────┬──┘  │
           │       │     │
        Да │       │ Нет │
           │       │     │
      ┌────▼───┐   │     │
      │  Тело  │   │     │
      │  цикла │   │     │
      └────┬───┘   │     │
           └───────┘     │
                  │      │
              ┌───▼──────▼┐
              │   Конец   │
              └───────────┘
      `,
      examples: {
        python: `# Python
# Цикл for
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# Цикл while
count = 0
while count < 5:
    print(count)
    count += 1

# Перебор списка
numbers = [1, 2, 3, 4, 5]
for num in numbers:
    print(num)`,
        javascript: `// JavaScript
// Цикл for
for (let i = 0; i < 5; i++) {
    console.log(i);  // 0, 1, 2, 3, 4
}

// Цикл while
let count = 0;
while (count < 5) {
    console.log(count);
    count++;
}

// Перебор массива
const numbers = [1, 2, 3, 4, 5];
for (const num of numbers) {
    console.log(num);
}`,
        cpp: `// C++
#include <iostream>
using namespace std;

int main() {
    // Цикл for
    for (int i = 0; i < 5; i++) {
        cout << i << endl;
    }
    
    // Цикл while
    int count = 0;
    while (count < 5) {
        cout << count << endl;
        count++;
    }
    
    return 0;
}`
      }
    },
    arrays: {
      title: 'Массивы и списки',
      theory: 'Массивы (списки) — упорядоченные коллекции элементов. Позволяют хранить множество значений под одним именем и обращаться к ним по индексу. Индексация начинается с 0.',
      flowchart: `
     Массив: [10, 20, 30, 40, 50]
     Индекс:  0   1   2   3   4
     
     ┌──────────────────────┐
     │  Создание массива    │
     └──────┬───────────────┘
            │
     ┌──────▼───────────────┐
     │  Добавление элемента │
     └──────┬───────────────┘
            │
     ┌──────▼───────────────┐
     │  Перебор элементов   │
     └──────┬───────────────┘
            │
     ┌──────▼───────────────┐
     │  Изменение элемента  │
     └──────────────────────┘
      `,
      examples: {
        python: `# Python
# Создание списка
numbers = [1, 2, 3, 4, 5]

# Доступ по индексу
print(numbers[0])  # 1

# Добавление элемента
numbers.append(6)

# Срезы
print(numbers[1:4])  # [2, 3, 4]

# Перебор
for num in numbers:
    print(num)

# Методы
numbers.sort()
numbers.reverse()`,
        javascript: `// JavaScript
// Создание массива
const numbers = [1, 2, 3, 4, 5];

// Доступ по индексу
console.log(numbers[0]);  // 1

// Добавление элемента
numbers.push(6);

// Срезы
console.log(numbers.slice(1, 4));

// Перебор
numbers.forEach(num => {
    console.log(num);
});

// Методы
numbers.sort();
numbers.reverse();`,
        cpp: `// C++
#include <iostream>
#include <vector>
using namespace std;

int main() {
    // Создание массива
    vector<int> numbers = {1, 2, 3, 4, 5};
    
    // Доступ по индексу
    cout << numbers[0] << endl;
    
    // Добавление элемента
    numbers.push_back(6);
    
    // Перебор
    for (int num : numbers) {
        cout << num << endl;
    }
    
    return 0;
}`
      }
    },
    strings: {
      title: 'Строки',
      theory: 'Строки — последовательности символов. Можно рассматривать как массив символов. Поддерживают множество операций: конкатенацию, поиск подстрок, замену, разбиение.',
      flowchart: `
     Строка: "Hello World"
     Индекс:  01234 56789
     
     ┌──────────────────────┐
     │  Создание строки     │
     └──────┬───────────────┘
            │
     ┌──────▼───────────────┐
     │  Конкатенация        │
     └──────┬───────────────┘
            │
     ┌──────▼───────────────┐
     │  Поиск подстроки     │
     └──────┬───────────────┘
            │
     ┌──────▼───────────────┐
     │  Замена символов     │
     └──────────────────────┘
      `,
      examples: {
        python: `# Python
# Создание строки
text = "Hello World"

# Конкатенация
full = text + "!"

# Доступ по индексу
print(text[0])  # 'H'

# Срезы
print(text[0:5])  # "Hello"

# Методы
print(text.lower())
print(text.upper())
print(text.replace("World", "Python"))
print(text.split())

# Форматирование
name = "Иван"
print(f"Привет, {name}!")`,
        javascript: `// JavaScript
// Создание строки
const text = "Hello World";

// Конкатенация
const full = text + "!";

// Доступ по индексу
console.log(text[0]);  // 'H'

// Срезы
console.log(text.slice(0, 5));

// Методы
console.log(text.toLowerCase());
console.log(text.toUpperCase());
console.log(text.replace("World", "JS"));
console.log(text.split(" "));

// Шаблонные строки
const name = "Иван";
console.log(\`Привет, \${name}!\`);`,
        cpp: `// C++
#include <iostream>
#include <string>
using namespace std;

int main() {
    // Создание строки
    string text = "Hello World";
    
    // Конкатенация
    string full = text + "!";
    
    // Доступ по индексу
    cout << text[0] << endl;
    
    // Подстрока
    cout << text.substr(0, 5) << endl;
    
    // Поиск
    size_t pos = text.find("World");
    cout << pos << endl;
    
    return 0;
}`
      }
    }
  };

  const languageColors: Record<Language, string> = {
    python: 'bg-yellow-500',
    javascript: 'bg-amber-400',
    cpp: 'bg-purple-500'
  };

  const languageNames: Record<Language, string> = {
    python: 'Python',
    javascript: 'JavaScript',
    cpp: 'C++'
  };

  const topicData = topics[selectedTopic];

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <Card className="bg-slate-900/50 border-slate-700 shadow-xl h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-slate-100">
            <Icon name="List" size={20} className="text-primary" />
            Темы
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(topics).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setSelectedTopic(key as Topic)}
              className={cn(
                "w-full text-left p-4 rounded-lg transition-all hover:bg-slate-800",
                selectedTopic === key 
                  ? "bg-primary/20 border-2 border-primary" 
                  : "bg-slate-800/50 border-2 border-transparent"
              )}
            >
              <p className={cn(
                "font-semibold",
                selectedTopic === key ? "text-primary" : "text-slate-300"
              )}>
                {data.title}
              </p>
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="bg-slate-900/50 border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-100">{topicData.title}</CardTitle>
            <CardDescription className="text-slate-400 text-base">
              {topicData.theory}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-slate-950 rounded-lg border border-slate-700">
              <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
                <Icon name="Workflow" size={16} />
                Блок-схема алгоритма
              </h3>
              <pre className="text-primary font-mono text-sm leading-relaxed whitespace-pre">
                {topicData.flowchart}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-slate-100">
              <Icon name="Code2" size={24} className="text-secondary" />
              Примеры кода
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="python">
              <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-700">
                {(['python', 'javascript', 'cpp'] as Language[]).map((lang) => (
                  <TabsTrigger 
                    key={lang} 
                    value={lang}
                    className="data-[state=active]:bg-slate-700"
                  >
                    <Badge className={cn(languageColors[lang], "text-slate-900 mr-2")}>
                      {lang === 'python' ? '🐍' : lang === 'javascript' ? '⚡' : '⚙️'}
                    </Badge>
                    {languageNames[lang]}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {(['python', 'javascript', 'cpp'] as Language[]).map((lang) => (
                <TabsContent key={lang} value={lang}>
                  <ScrollArea className="h-[500px] w-full rounded-lg border border-slate-700">
                    <pre className="p-6 bg-slate-950 text-slate-300 font-mono text-sm leading-relaxed">
                      <code>{topicData.examples[lang]}</code>
                    </pre>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CodeHandbook;
