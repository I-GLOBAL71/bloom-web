import React from 'react';
import { motion } from 'framer-motion';
import { StatCard } from '../ui/StatCard';
import { staggerChildren } from '../animations/variants';

export function StatsSection() {
  return (
    <motion.div 
      className="py-20 px-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerChildren}
    >
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <StatCard number="2M+" text="Utilisateurs actifs" />
          <StatCard number="150k" text="Couples formés" />
          <StatCard number="98%" text="Taux de satisfaction" />
        </div>
      </div>
    </motion.div>
  );
}