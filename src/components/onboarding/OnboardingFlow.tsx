import React, { useState } from 'react';
import { OnboardingLayout } from './OnboardingLayout';
import { NameStep } from './steps/NameStep';
import { AgeStep } from './steps/AgeStep';
import { GenderStep } from './steps/GenderStep';
import { LocationStep } from './steps/LocationStep';
import { ProfessionStep } from './steps/ProfessionStep';
import { HobbiesStep } from './steps/HobbiesStep';
import { PreferencesStep } from './steps/PreferencesStep';
import { RelationshipTypeStep } from './steps/RelationshipTypeStep';
import { PhotoStep } from './steps/PhotoStep';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    location: '',
    profession: '',
    hobbies: [] as string[],
    preferredProfiles: [] as string[],
    relationshipType: '',
    photos: [] as string[]
  });

  const totalSteps = 9;

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (currentStep === totalSteps) {
      // Si c'est la dernière étape, on termine l'onboarding
      onComplete();
    } else {
      // Sinon on passe à l'étape suivante
      setCurrentStep(prev => prev + 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <NameStep value={formData.name} onNext={value => updateFormData('name', value)} />;
      case 2:
        return <AgeStep value={formData.age} onNext={value => updateFormData('age', value)} />;
      case 3:
        return <GenderStep value={formData.gender} onNext={value => updateFormData('gender', value)} />;
      case 4:
        return <LocationStep value={formData.location} onNext={value => updateFormData('location', value)} />;
      case 5:
        return <ProfessionStep value={formData.profession} onNext={value => updateFormData('profession', value)} />;
      case 6:
        return <HobbiesStep value={formData.hobbies} onNext={value => updateFormData('hobbies', value)} />;
      case 7:
        return <PreferencesStep value={formData.preferredProfiles} onNext={value => updateFormData('preferredProfiles', value)} />;
      case 8:
        return <RelationshipTypeStep value={formData.relationshipType} onNext={value => updateFormData('relationshipType', value)} />;
      case 9:
        return <PhotoStep value={formData.photos} onNext={value => updateFormData('photos', value)} />;
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout currentStep={currentStep} totalSteps={totalSteps}>
      {renderStep()}
    </OnboardingLayout>
  );
}