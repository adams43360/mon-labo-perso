import { useState } from 'react';
import { Theme, Dropdown } from '@carbon/react';
import { OnboardingFlow } from './features/onboarding/OnboardingFlow';

// Le sélecteur de thème est le cœur de la démonstration :
// changer de thème rethème toute l'app via les tokens sémantiques Carbon,
// sans toucher au code des composants ni écrire de CSS.
const THEMES = [
  { id: 'white', label: 'White (clair)' },
  { id: 'g90', label: 'Gray 90 (sombre)' },
  { id: 'g100', label: 'Gray 100 (très sombre)' },
] as const;

type ThemeId = (typeof THEMES)[number]['id'];

export default function App() {
  const [theme, setTheme] = useState<ThemeId>('white');

  return (
    <Theme theme={theme} className="app-shell">
      <main className="app-main">
        <div style={{ marginBottom: '2rem', maxWidth: '18rem' }}>
          <Dropdown
            id="theme-picker"
            titleText="Thème (tokens Carbon)"
            label="Choisir un thème"
            items={[...THEMES]}
            itemToString={(item) => item?.label ?? ''}
            selectedItem={THEMES.find((t) => t.id === theme)}
            onChange={({ selectedItem }) => {
              if (selectedItem) setTheme(selectedItem.id);
            }}
          />
        </div>
        <OnboardingFlow />
      </main>
    </Theme>
  );
}
