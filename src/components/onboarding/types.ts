export interface OnboardingStepProps {
  onNext: (data: any) => void;
  onBack?: () => void;
  data?: any;
  isFirstStep?: boolean;
  isLastStep?: boolean;
}
