import React from 'react';
import { Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Logo } from '../ui/Logo';

type CategoryType = 'company' | 'support' | 'legal' | 'features';
type LinksByCategory = {
  [key in CategoryType]: string[];
};

export function Footer() {
  const { t } = useTranslation('landing');

  const categories: CategoryType[] = ['company', 'support', 'legal', 'features'];
  const linksByCategory: LinksByCategory = {
    company: ['about', 'careers', 'press', 'blog'],
    support: ['help', 'safety', 'guidelines'],
    legal: ['terms', 'privacy', 'cookies'],
    features: ['premium', 'events', 'stories', 'app']
  };

  const socialLinks = [
    { id: 'instagram', icon: Instagram, href: '#instagram' },
    { id: 'twitter', icon: Twitter, href: '#twitter' },
    { id: 'facebook', icon: Facebook, href: '#facebook' },
    { id: 'linkedin', icon: Linkedin, href: '#linkedin' }
  ];

  return (
    <footer className="bg-white border-t border-pink-100">
      <div className="container mx-auto px-4 py-12">
        {/* Footer content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="font-semibold text-gray-900 mb-4">
                {t(`footer.categories.${category}`)}
              </h3>
              <ul className="space-y-2">
                {linksByCategory[category].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-pink-500 transition-colors"
                    >
                      {t(`footer.links.${link}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-pink-100">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo and copyright */}
            <div className="flex items-center gap-2">
              <Logo className="h-16 w-auto" />
              <span className="text-gray-600 text-sm ml-2">
                {t('footer.copyright', { year: new Date().getFullYear() })}
              </span>
            </div>

            {/* Social links */}
            <div className="flex items-center gap-4">
              {socialLinks.map(({ id, icon: Icon, href }) => (
                <a
                  key={id}
                  href={href}
                  className="p-2 text-gray-600 hover:text-pink-500 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}