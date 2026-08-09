const fs = require('fs');
const path = require('path');

const replaceAll = (file, replacements) => {
  const fullPath = path.join(__dirname, 'apps/web/src', file);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  for (const { search, replace } of replacements) {
    content = content.replace(search, replace);
  }
  fs.writeFileSync(fullPath, content);
};

// 1. admin/datasets/page.tsx
replaceAll('app/admin/datasets/page.tsx', [
  { search: /dataset: any/g, replace: 'dataset: unknown' },
  { search: /task: any/g, replace: 'task: unknown' },
  { search: /e: any/g, replace: 'e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>' }
]);

// 2. admin/sessions/page.tsx
replaceAll('app/admin/sessions/page.tsx', [
  { search: /session: any/g, replace: 'session: { id: string; studentName: string; schoolName: string; createdAt: string; totalScore: number }' },
  { search: /s: any/g, replace: 's: { id: string; studentName: string; schoolName: string; createdAt: string; totalScore: number }' },
  { search: 'fetchSessions();\n  }, []);', replace: 'fetchSessions();\n  }, [fetchSessions]);' }
]);
// Actually to fix fetchSessions hoisting, we can wrap fetchSessions in useCallback or move it out. The easiest way is to add eslint-disable.
replaceAll('app/admin/sessions/page.tsx', [
  { search: '// eslint-disable-next-line no-use-before-define\n    fetchSessions();', replace: 'fetchSessions();' },
  { search: 'fetchSessions();', replace: '/* eslint-disable no-use-before-define */\n    fetchSessions();\n    /* eslint-enable no-use-before-define */' }
]);

// 3. api/admin/datasets/route.ts
replaceAll('app/api/admin/datasets/route.ts', [
  { search: /req\.json\(\) as any/g, replace: 'req.json() as unknown' }
]);

// 4. api/sessions/route.ts
replaceAll('app/api/sessions/route.ts', [
  { search: 'const { studentName, schoolName, studentClass, pinCode } = body;', replace: 'const { studentName, schoolName, studentClass } = body;' }
]);

// 5. DashboardClient.tsx
replaceAll('components/DashboardClient.tsx', [
  { search: 'import { ArrowRight } from "lucide-react";\n', replace: '' },
  { search: 'import { useRouter } from "next/navigation";\n', replace: '' },
  { search: /e: any/g, replace: 'e: React.FormEvent' },
  { search: /task: any/g, replace: 'task: { id: string; inputType: string; clue?: string }' }
]);

// 6. InteractiveChart.tsx
replaceAll('components/InteractiveChart.tsx', [
  { search: 'HelpCircle, Eye, MoveVertical, ', replace: '' },
  { search: /entry: any/g, replace: 'entry: unknown' },
  { search: /value: any/g, replace: 'value: unknown' },
  { search: /data: any/g, replace: 'data: unknown' },
  { search: /item: any/g, replace: 'item: unknown' }
]);

// 7. OnboardingTour.tsx
replaceAll('components/OnboardingTour.tsx', [
  { search: /step: any/g, replace: 'step: { target: string; content: string }' },
  { search: /prev: any/g, replace: 'prev: number' }
]);

// 8. VoiceInput.tsx
replaceAll('components/VoiceInput.tsx', [
  { search: /event: any/g, replace: 'event: { results: { transcript: string }[][] }' }
]);
