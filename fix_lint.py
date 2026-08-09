import os
import re

base_dir = '/Users/mac/PROYEK/STATSLAB/apps/web/src'

def process_file(filepath, replacements):
    full_path = os.path.join(base_dir, filepath)
    if not os.path.exists(full_path):
        return
    with open(full_path, 'r') as f:
        content = f.read()
    
    orig = content
    for search, replace in replacements:
        content = re.sub(search, replace, content)
    
    if orig != content:
        with open(full_path, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

# admin/datasets/page.tsx
process_file('app/admin/datasets/page.tsx', [
    (r'dataset: any', r'dataset: unknown'),
    (r'task: any', r'task: unknown'),
    (r'e: any', r'e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>'),
])

# admin/sessions/page.tsx
process_file('app/admin/sessions/page.tsx', [
    (r'session: any', r'session: unknown'),
    (r's: any', r's: unknown'),
])

# api/admin/datasets/route.ts
process_file('app/api/admin/datasets/route.ts', [
    (r'req\.json\(\) as any', r'req.json() as unknown'),
])

# DashboardClient.tsx
process_file('components/DashboardClient.tsx', [
    (r'e: any', r'e: React.FormEvent'),
    (r'task: any', r'task: unknown'),
])

# InteractiveChart.tsx
process_file('components/InteractiveChart.tsx', [
    (r'entry: any', r'entry: unknown'),
    (r'value: any', r'value: unknown'),
    (r'data: any', r'data: unknown'),
    (r'item: any', r'item: unknown'),
    (r'payload: any', r'payload: unknown'),
])

# OnboardingTour.tsx
process_file('components/OnboardingTour.tsx', [
    (r'step: any', r'step: { target: string; content: string }'),
    (r'prev: any', r'prev: number'),
])

# VoiceInput.tsx
process_file('components/VoiceInput.tsx', [
    (r'event: any', r'event: unknown'),
])

print("Python script completed.")
