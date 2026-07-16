import { describe, expect, it } from 'vitest';
import {
  emptyData,
  isStepValid,
  isValidEmail,
  validateStep,
  type OnboardingData,
} from '../src/features/onboarding/validation';

const validData: OnboardingData = {
  orgName: 'Atelier Ruiz',
  sector: 'SaaS / Tech',
  teamSize: 4,
  plan: 'pro',
  notifications: true,
  launchDate: '2026-09-01',
  invites: ['ana@exemple.com', 'leo@exemple.com'],
};

describe('validateStep — étape 0 (organisation)', () => {
  it('accepte des données valides', () => {
    expect(validateStep(0, validData)).toEqual({});
  });

  it('rejette un nom trop court', () => {
    expect(validateStep(0, { ...validData, orgName: 'A' })).toHaveProperty('orgName');
  });

  it('exige un secteur', () => {
    expect(validateStep(0, { ...validData, sector: '' })).toHaveProperty('sector');
  });

  it('exige une taille d’équipe d’au moins 1', () => {
    expect(validateStep(0, { ...validData, teamSize: 0 })).toHaveProperty('teamSize');
    expect(validateStep(0, { ...validData, teamSize: NaN })).toHaveProperty('teamSize');
  });
});

describe('validateStep — étape 1 (préférences)', () => {
  it('exige un plan', () => {
    expect(validateStep(1, { ...validData, plan: '' })).toHaveProperty('plan');
    expect(validateStep(1, validData)).toEqual({});
  });

  it('la date de lancement est optionnelle', () => {
    expect(validateStep(1, { ...validData, launchDate: '' })).toEqual({});
  });
});

describe('validateStep — étape 2 (invitations)', () => {
  it('exige au moins une invitation', () => {
    expect(validateStep(2, { ...validData, invites: [] })).toHaveProperty('invites');
  });

  it('rejette une adresse invalide et la cite dans le message', () => {
    const errors = validateStep(2, { ...validData, invites: ['pas-un-email'] });
    expect(errors.invites).toContain('pas-un-email');
  });

  it('accepte des adresses valides', () => {
    expect(validateStep(2, validData)).toEqual({});
  });
});

describe('isValidEmail', () => {
  it.each(['ana@exemple.com', 'a.b+c@sub.domaine.fr'])('accepte %s', (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  it.each(['', 'sans-arobase', 'a@b', 'a @b.com'])('rejette "%s"', (email) => {
    expect(isValidEmail(email)).toBe(false);
  });
});

describe('isStepValid', () => {
  it('reflète l’absence d’erreurs', () => {
    expect(isStepValid(0, validData)).toBe(true);
    expect(isStepValid(0, emptyData)).toBe(false);
  });
});
