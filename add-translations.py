#!/usr/bin/env python3
"""
Script to add useTranslation hook to all screen files
This adds the necessary import and hook declaration
"""

import os
import re

# List of screen files to update
SCREEN_FILES = [
    'src/screens/onboarding/ProfileSetupScreen.tsx',
    'src/screens/onboarding/WageInputScreen.tsx',
    'src/screens/onboarding/CurrencySelectionScreen.tsx',
    'src/screens/dashboard/DashboardScreen.tsx',
    'src/screens/item-check/ItemCheckModal.tsx',
    'src/screens/item-check/ResultScreen.tsx',
    'src/screens/history/TransactionHistoryScreen.tsx',
    'src/screens/history/TransactionDetailScreen.tsx',
    'src/screens/settings/SettingsScreen.tsx',
    'src/screens/settings/ProfileEditScreen.tsx',
    'src/screens/settings/ThemeSelectionScreen.tsx',
    'src/screens/settings/CurrencySettingsScreen.tsx',
]

def add_translation_import(content):
    """Add useTranslation import if not present"""
    if 'useTranslation' in content:
        return content

    # Find the last import statement
    import_pattern = r"(import .+ from '.+';)\n"
    matches = list(re.finditer(import_pattern, content))

    if matches:
        last_import = matches[-1]
        insert_pos = last_import.end()
        new_import = "import { useTranslation } from 'react-i18next';\n"
        content = content[:insert_pos] + new_import + content[insert_pos:]

    return content

def add_translation_hook(content):
    """Add useTranslation hook declaration if not present"""
    if "const { t" in content or "const { i18n" in content:
        return content

    # Find the component function and add hook after existing hooks
    # Look for patterns like: const { theme } = useTheme();
    hook_pattern = r"(const .+ = use.+\(\);)\n"
    matches = list(re.finditer(hook_pattern, content))

    if matches:
        last_hook = matches[-1]
        insert_pos = last_hook.end()
        new_hook = "  const { t } = useTranslation();\n"
        content = content[:insert_pos] + new_hook + content[insert_pos:]

    return content

def main():
    for file_path in SCREEN_FILES:
        full_path = os.path.join('/home/teo/workspace/Biosi', file_path)

        if not os.path.exists(full_path):
            print(f"File not found: {file_path}")
            continue

        with open(full_path, 'r') as f:
            content = f.read()

        original_content = content
        content = add_translation_import(content)
        content = add_translation_hook(content)

        if content != original_content:
            with open(full_path, 'w') as f:
                f.write(content)
            print(f"Updated: {file_path}")
        else:
            print(f"No changes needed: {file_path}")

if __name__ == '__main__':
    main()
    print("\nDone! Now you need to replace hardcoded strings with t() calls manually.")
    print("See the translation keys in src/locales/en.json and src/locales/fr.json")
