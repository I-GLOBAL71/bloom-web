import React, { useState } from 'react';
<<<<<<< HEAD
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { UsernameStep } from './steps/UsernameStep';
import { AgeStep } from './steps/AgeStep';
import { GenderStep } from './steps/GenderStep';
import { InterestedInStep } from './steps/InterestedInStep';
import { ProfessionStep } from './steps/ProfessionStep';
import { PhoneStep } from './steps/PhoneStep';
import { PhotosStep } from './steps/PhotosStep';
import { ProgressIndicator } from './ProgressIndicator';
import { InterestsStep } from './steps/InterestsStep';
import { LocationStep } from './steps/LocationStep';

const STEPS = [
  'username',
  'age',
  'gender',
  'interests',
  'interestedIn',
  'profession',
  'location',
  'phone',
  'photos'
];

export function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  interface FormData {
    username: string;
    age: number | '';
    gender: string;
    interestedIn: string[];
    interests: string[];
    profession: string;
    city: string;
    country: string;
    phone: string;
    countryCode: string;
    photos: string[];
    video: File | null;
  }

  const [formData, setFormData] = useState<FormData>({
    username: '',
    age: '',
    gender: '',
    interestedIn: [],
    interests: [],
    profession: '',
    city: '',
    country: '',
    phone: '',
    countryCode: '',
    photos: [],
    video: null
  });

  const handleNext = (stepData: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleComplete = async (): Promise<void> => {
    try {
      if (!user) {
        throw new Error('No user found');
      }

      // Initialiser Firestore
      const db = getFirestore(getApp());
      const userRef = doc(db, 'users', user.id);

      // Sauvegarder les données d'onboarding sans les photos pour le moment
      const userData = {
        name: formData.username,
        age: formData.age,
        gender: formData.gender,
        interestedIn: formData.interestedIn,
        interests: formData.interests,
        profession: formData.profession,
        location: {
          city: formData.city,
          country: formData.country,
          coordinates: { lat: 0, lng: 0 }
        },
        phone: formData.phone,
        countryCode: formData.countryCode,
        hasCompletedOnboarding: true,
        updatedAt: new Date()
      };

      // Sauvegarder les données dans Firestore
      await setDoc(userRef, userData, { merge: true });
      
      // Mettre à jour l'état de l'utilisateur
      await updateUser({
        ...userData,
        hasCompletedOnboarding: true
      });

      // Attendre un court instant pour s'assurer que tous les états sont synchronisés
      await new Promise(resolve => setTimeout(resolve, 500));

      // Rediriger vers le dashboard
      navigate('/app/dashboard', { replace: true });

    } catch (error) {
      console.error('Error saving onboarding data:', error);
      throw error;
=======
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
>>>>>>> 87fc930cd04ba868c1f63169404dd48ded0af678
    }
  };

  const renderStep = () => {
<<<<<<< HEAD
    switch (STEPS[currentStep]) {
      case 'username':
        return (
          <UsernameStep 
            onNext={handleNext} 
            initialValue={formData.username} 
            onBack={currentStep > 0 ? handleBack : undefined} 
          />
        );
      case 'age':
        return (
          <AgeStep 
            onNext={handleNext} 
            initialValue={formData.age} 
            onBack={handleBack} 
          />
        );
      case 'gender':
        return (
          <GenderStep 
            onNext={handleNext} 
            initialValue={formData.gender} 
            onBack={handleBack} 
          />
        );
      case 'interests':
        return (
          <InterestsStep 
            onNext={handleNext} 
            initialValue={formData.interests} 
            onBack={handleBack} 
          />
        );
      case 'interestedIn':
        return (
          <InterestedInStep 
            onNext={handleNext} 
            initialValue={formData.interestedIn} 
            onBack={handleBack} 
          />
        );
      case 'profession':
        return (
          <ProfessionStep
            onNext={handleNext}
            initialValue={formData.profession}
            onBack={handleBack}
          />
        );
      case 'location':
        return (
          <LocationStep
            onNext={handleNext}
            initialCity={formData.city}
            onBack={handleBack}
          />
        );
      case 'phone':
        return (
          <PhoneStep 
            onNext={handleNext} 
            initialPhone={formData.phone}
            initialCountryCode={formData.countryCode}
            onBack={handleBack}
          />
        );
      case 'photos':
        return (
          <PhotosStep 
            onComplete={handleComplete}
            initialPhotos={formData.photos}
            initialVideo={formData.video}
            onBack={handleBack}
          />
        );
=======
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
>>>>>>> 87fc930cd04ba868c1f63169404dd48ded0af678
      default:
        return null;
    }
  };

<<<<<<< HEAD
  // Définir la direction du contenu en fonction de la langue
  const isRTL = ['ar', 'ur'].includes(currentLanguage);
  const slideDirection = isRTL ? -1 : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50"
         dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-md mx-auto pt-8 px-4">
        <ProgressIndicator 
          currentStep={currentStep} 
          totalSteps={STEPS.length} 
        />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 * slideDirection }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 * slideDirection }}
            transition={{ duration: 0.2 }}
            className="mt-8"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
=======
  return (
    <OnboardingLayout currentStep={currentStep} totalSteps={totalSteps}>
      {renderStep()}
    </OnboardingLayout>
>>>>>>> 87fc930cd04ba868c1f63169404dd48ded0af678
  );
}