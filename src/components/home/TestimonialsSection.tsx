import React from 'react';
import { motion } from 'framer-motion';
import { TestimonialCard } from '../ui/TestimonialCard';
import { staggerChildren } from '../animations/variants';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Marie L.",
      age: 28,
      text: "Grâce à Bloom, j'ai rencontré quelqu'un qui partage vraiment mes valeurs. L'approche élégante de l'application rend l'expérience unique.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop"
    },
    {
      name: "Thomas R.",
      age: 32,
      text: "Les conversations sont tellement plus authentiques ici. J'apprécie particulièrement le système de matching qui favorise les connexions significatives.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop"
    },
    {
      name: "Sophie M.",
      age: 30,
      text: "L'interface est magnifique et l'expérience est vraiment différente des autres applications. J'ai trouvé l'amour en quelques semaines !",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&auto=format&fit=crop"
    }
  ];

  return (
    <motion.div 
      className="py-20 px-6 bg-gradient-to-br from-pink-50 to-amber-50"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerChildren}
    >
      <div className="container mx-auto">
        <motion.h2 
          className="text-4xl font-bold text-center mb-16"
          variants={staggerChildren}
        >
          Ils ont trouvé l'amour sur <span className="bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent">Bloom</span>
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}