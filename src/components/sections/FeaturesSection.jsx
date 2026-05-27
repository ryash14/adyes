import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Zap, Shield, Globe, Users } from 'lucide-react';

const features = [
  {
    title: 'Lightning Fast',
    description: 'Built on edge infrastructure. Zero latency collaboration globally.',
    icon: <Zap className="w-6 h-6 text-neon-accent" />,
    className: 'md:col-span-2'
  },
  {
    title: 'Enterprise Security',
    description: 'Bank-grade encryption for all your intellectual property.',
    icon: <Shield className="w-6 h-6 text-neon-accent" />,
    className: 'md:col-span-1'
  },
  {
    title: 'Global Network',
    description: 'Connect with top-tier talent across 150+ countries instantly.',
    icon: <Globe className="w-6 h-6 text-neon-accent" />,
    className: 'md:col-span-1'
  },
  {
    title: 'Real-time Sync',
    description: 'Multi-player editing, brainstorming, and code pairing in real-time.',
    icon: <Users className="w-6 h-6 text-neon-accent" />,
    className: 'md:col-span-2'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 md:px-8 bg-background relative z-10">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="text-neon-accent font-bold tracking-[0.2em] uppercase text-sm block mb-4">/ Features</span>
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-foreground">
            Engineered for <br/> Peak Performance.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={feature.className}
            >
              <Card className="h-full group hover:bg-zinc-900/50">
                <div className="w-12 h-12 rounded-lg bg-zinc-900 border-2 border-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[2px_2px_0_0_#CCFF00]">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold uppercase tracking-wide mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
