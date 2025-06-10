import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, MessageCircleHeart } from 'lucide-react';
import { FeatureCard } from '../ui/FeatureCard';
import { staggerChildren } from '../animations/variants';

export function FeaturesSection() {
  return (
    <motion.div 
      className="py-20 bg-white/50 backdrop-blur-md"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerChildren}
    >
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          <FeatureCard
            icon={<Heart className="w-8 h-8 text-pink-500" />}
            title="Matchs Intelligents"
            description="Notre algorithme avancé vous connecte avec des personnes qui partagent vos valeurs et vos intérêts."
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8 text-amber-500" />}
            title="Sécurité Garantie"
            description="Profitez d'un environnement sûr avec vérification des profils et protection des données."
          />
          <FeatureCard
            icon={<MessageCircleHeart className="w-8 h-8 text-pink-500" />}
            title="Conversations Authentiques"
            description="Échangez dans un cadre bienveillant favorisant des connexions significatives."
          />
        </div>
      </div>
    </motion.div>
  );
}