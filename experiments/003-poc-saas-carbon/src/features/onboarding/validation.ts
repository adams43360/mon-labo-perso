// Règles de validation pures du parcours d'onboarding.
// Séparées des composants pour être testables sans rendu (Vitest).

export type Plan = 'starter' | 'pro' | 'enterprise';

export interface OnboardingData {
  orgName: string;
  sector: string;
  teamSize: number;
  plan: Plan | '';
  notifications: boolean;
  launchDate: string; // ISO yyyy-mm-dd, ou '' si non renseignée
  invites: string[];
}

export type StepErrors = Record<string, string>;

export const emptyData: OnboardingData = {
  orgName: '',
  sector: '',
  teamSize: 1,
  plan: '',
  notifications: true,
  launchDate: '',
  invites: [],
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function validateStep(step: number, data: OnboardingData): StepErrors {
  const errors: StepErrors = {};

  if (step === 0) {
    if (data.orgName.trim().length < 2) {
      errors.orgName = 'Le nom de l’organisation doit faire au moins 2 caractères.';
    }
    if (!data.sector) {
      errors.sector = 'Choisissez un secteur.';
    }
    if (!Number.isFinite(data.teamSize) || data.teamSize < 1) {
      errors.teamSize = 'La taille d’équipe doit être d’au moins 1 personne.';
    }
  }

  if (step === 1) {
    if (!data.plan) {
      errors.plan = 'Choisissez un plan pour continuer.';
    }
  }

  if (step === 2) {
    if (data.invites.length === 0) {
      errors.invites = 'Invitez au moins une personne (ou votre propre adresse).';
    } else {
      const invalid = data.invites.filter((email) => !isValidEmail(email));
      if (invalid.length > 0) {
        errors.invites = `Adresse(s) invalide(s) : ${invalid.join(', ')}`;
      }
    }
  }

  return errors;
}

export function isStepValid(step: number, data: OnboardingData): boolean {
  return Object.keys(validateStep(step, data)).length === 0;
}
