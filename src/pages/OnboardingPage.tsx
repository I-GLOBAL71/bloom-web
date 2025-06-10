<<<<<<< HEAD
import { OnboardingFlow } from '../components/onboarding/OnboardingFlow';

export function OnboardingPage() {
  return <OnboardingFlow />;
}
=======
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logger } from '../utils/logger';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Import all steps
import { NameStep } from '../components/onboarding/steps/NameStep';
import { AgeStep } from '../components/onboarding/steps/AgeStep';
import { GenderStep } from '../components/onboarding/steps/GenderStep';
import { LocationStep } from '../components/onboarding/steps/LocationStep';
import { ProfessionStep } from '../components/onboarding/steps/ProfessionStep';
import { HobbiesStep } from '../components/onboarding/steps/HobbiesStep';
import { PhotoStep } from '../components/onboarding/steps/PhotoStep';
import { PreferencesStep } from '../components/onboarding/steps/PreferencesStep';
import { RelationshipTypeStep } from '../components/onboarding/steps/RelationshipTypeStep';
import { PhoneStep } from '../components/onboarding/steps/PhoneStep';

const steps = [
  { id: 'name', component: NameStep },
  { id: 'phone', component: PhoneStep },
  { id: 'age', component: AgeStep },
  { id: 'gender', component: GenderStep },
  { id: 'location', component: LocationStep },
  { id: 'profession', component: ProfessionStep },
  { id: 'hobbies', component: HobbiesStep },
  { id: 'preferences', component: PreferencesStep },
  { id: 'relationshipType', component: RelationshipTypeStep },
  { id: 'photo', component: PhotoStep },
];

export function OnboardingPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated
    if (!currentUser) {
      navigate('/login');
      return;
    }

    logger.info('OnboardingPage', 'Component mounted', {
      currentStep: steps[currentStepIndex].id
    });
  }, [currentUser, currentStepIndex, navigate]);

  const handleNext = (stepData: any) => {
    logger.info('OnboardingPage', 'Step completed', {
      step: steps[currentStepIndex].id,
      data: stepData
    });

    const updatedFormData = { ...formData, [steps[currentStepIndex].id]: stepData };
    setFormData(updatedFormData);

    if (currentStepIndex === steps.length - 1) {
      handleComplete(stepData);
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleComplete = async (finalStepData: any) => {
    const completeProfile = { 
      ...formData, 
      ...finalStepData,
      userId: currentUser?.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      // Save profile to Firestore
      const profileRef = doc(db, 'profiles', currentUser?.uid || '');
      await setDoc(profileRef, completeProfile);
      
      logger.info('OnboardingPage', 'Onboarding completed', {
        profile: completeProfile
      });

      // Navigate to dashboard
      navigate('/dashboard/home', { replace: true });
    } catch (error) {
      console.error('Error saving profile:', error);
      // Show error to user
    }
  };

  const CurrentStep = steps[currentStepIndex].component;
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Progress bar */}
        <div className="w-full h-2 bg-white/30 rounded-full mb-8">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-400 to-pink-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Step counter */}
        <div className="text-center mb-8">
          <span className="text-sm font-medium text-gray-600">
            Étape {currentStepIndex + 1} sur {steps.length}
          </span>
        </div>

        {/* Step content */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentStep
                onNext={handleNext}
                onBack={handleBack}
                data={formData[steps[currentStepIndex].id]}
                isFirstStep={currentStepIndex === 0}
                isLastStep={currentStepIndex === steps.length - 1}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
>>>>>>> 87fc930cd04ba868c1f63169404dd48ded0af678
