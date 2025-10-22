import OnboardingFlow from '../OnboardingFlow';

export default function OnboardingFlowExample() {
  return (
    <OnboardingFlow
      onComplete={() => console.log('Onboarding completed')}
      onSkip={() => console.log('Onboarding skipped')}
    />
  );
}
