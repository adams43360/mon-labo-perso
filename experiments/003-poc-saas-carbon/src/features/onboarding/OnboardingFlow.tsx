import { useState } from 'react';
import {
  Button,
  ButtonSet,
  DatePicker,
  DatePickerInput,
  Form,
  InlineNotification,
  NumberInput,
  ProgressIndicator,
  ProgressStep,
  RadioButton,
  RadioButtonGroup,
  Select,
  SelectItem,
  Stack,
  Tag,
  TextInput,
  Tile,
  Toggle,
} from '@carbon/react';
import {
  emptyData,
  isValidEmail,
  validateStep,
  type OnboardingData,
  type Plan,
  type StepErrors,
} from './validation';

const STEPS = ['Organisation', 'Préférences', 'Invitations', 'Récapitulatif'];

const SECTORS = ['SaaS / Tech', 'Industrie', 'Santé', 'Finance', 'Éducation', 'Autre'];

const PLAN_LABELS: Record<Plan, string> = {
  starter: 'Starter — gratuit, 3 utilisateurs',
  pro: 'Pro — 12 €/utilisateur/mois',
  enterprise: 'Enterprise — sur devis',
};

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(emptyData);
  const [errors, setErrors] = useState<StepErrors>({});
  const [inviteDraft, setInviteDraft] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const patch = (partial: Partial<OnboardingData>) => setData((d) => ({ ...d, ...partial }));

  const next = () => {
    const stepErrors = validateStep(step, data);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) setStep((s) => s + 1);
  };

  const prev = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const addInvite = () => {
    const email = inviteDraft.trim();
    if (!email) return;
    if (!data.invites.includes(email)) patch({ invites: [...data.invites, email] });
    setInviteDraft('');
  };

  if (submitted) {
    return (
      <InlineNotification
        kind="success"
        title="Espace de travail créé"
        subtitle={`« ${data.orgName} » est prêt. ${data.invites.length} invitation(s) envoyée(s).`}
        lowContrast
        hideCloseButton
      />
    );
  }

  return (
    <Stack gap={7}>
      <h1>Créer votre espace de travail</h1>

      <ProgressIndicator currentIndex={step} spaceEqually>
        {STEPS.map((label, i) => (
          <ProgressStep key={label} label={label} complete={i < step} current={i === step} />
        ))}
      </ProgressIndicator>

      <Form onSubmit={(e) => e.preventDefault()}>
        <Stack gap={6}>
          {step === 0 && (
            <>
              <TextInput
                id="org-name"
                labelText="Nom de l’organisation"
                placeholder="Ex. : Atelier Ruiz"
                value={data.orgName}
                invalid={Boolean(errors.orgName)}
                invalidText={errors.orgName}
                onChange={(e) => patch({ orgName: e.target.value })}
              />
              <Select
                id="sector"
                labelText="Secteur d’activité"
                value={data.sector}
                invalid={Boolean(errors.sector)}
                invalidText={errors.sector}
                onChange={(e) => patch({ sector: e.target.value })}
              >
                <SelectItem value="" text="Choisir un secteur" />
                {SECTORS.map((s) => (
                  <SelectItem key={s} value={s} text={s} />
                ))}
              </Select>
              <NumberInput
                id="team-size"
                label="Taille de l’équipe"
                min={1}
                max={500}
                value={data.teamSize}
                invalid={Boolean(errors.teamSize)}
                invalidText={errors.teamSize}
                onChange={(_e, { value }) => patch({ teamSize: Number(value) })}
              />
            </>
          )}

          {step === 1 && (
            <>
              <RadioButtonGroup
                legendText="Plan"
                name="plan"
                orientation="vertical"
                valueSelected={data.plan}
                invalid={Boolean(errors.plan)}
                invalidText={errors.plan}
                onChange={(value) => patch({ plan: value as Plan })}
              >
                {(Object.keys(PLAN_LABELS) as Plan[]).map((p) => (
                  <RadioButton key={p} id={`plan-${p}`} value={p} labelText={PLAN_LABELS[p]} />
                ))}
              </RadioButtonGroup>
              <Toggle
                id="notifications"
                labelText="Notifications par e-mail"
                labelA="Désactivées"
                labelB="Activées"
                toggled={data.notifications}
                onToggle={(checked) => patch({ notifications: checked })}
              />
              <DatePicker
                datePickerType="single"
                dateFormat="d/m/Y"
                onChange={(dates) => {
                  const d = dates[0];
                  patch({ launchDate: d ? d.toISOString().slice(0, 10) : '' });
                }}
              >
                <DatePickerInput
                  id="launch-date"
                  labelText="Date de lancement (optionnelle)"
                  placeholder="jj/mm/aaaa"
                />
              </DatePicker>
            </>
          )}

          {step === 2 && (
            <>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                <TextInput
                  id="invite-email"
                  labelText="Inviter un coéquipier"
                  placeholder="prenom@entreprise.com"
                  value={inviteDraft}
                  invalid={inviteDraft.length > 0 && !isValidEmail(inviteDraft)}
                  invalidText="Format d’adresse invalide."
                  onChange={(e) => setInviteDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addInvite();
                    }
                  }}
                />
                <Button kind="secondary" onClick={addInvite} disabled={!isValidEmail(inviteDraft)}>
                  Ajouter
                </Button>
              </div>
              <div>
                {data.invites.map((email) => (
                  <Tag
                    key={email}
                    type="blue"
                    filter
                    onClose={() => patch({ invites: data.invites.filter((i) => i !== email) })}
                  >
                    {email}
                  </Tag>
                ))}
              </div>
              {errors.invites && (
                <InlineNotification
                  kind="error"
                  title="Invitations"
                  subtitle={errors.invites}
                  lowContrast
                  hideCloseButton
                />
              )}
            </>
          )}

          {step === 3 && (
            <Tile>
              <Stack gap={4}>
                <h3>Récapitulatif</h3>
                <p>
                  <strong>{data.orgName}</strong> — {data.sector}, {data.teamSize} personne(s)
                </p>
                <p>
                  Plan : {data.plan ? PLAN_LABELS[data.plan as Plan] : '—'}
                  <br />
                  Notifications : {data.notifications ? 'activées' : 'désactivées'}
                  <br />
                  Lancement : {data.launchDate || 'non planifié'}
                </p>
                <p>Invitations : {data.invites.join(', ')}</p>
              </Stack>
            </Tile>
          )}

          <ButtonSet>
            <Button kind="secondary" onClick={prev} disabled={step === 0}>
              Précédent
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={next}>Suivant</Button>
            ) : (
              <Button onClick={() => setSubmitted(true)}>Créer l’espace de travail</Button>
            )}
          </ButtonSet>
        </Stack>
      </Form>
    </Stack>
  );
}
