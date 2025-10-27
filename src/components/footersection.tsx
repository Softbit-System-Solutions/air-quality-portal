"use client";

import React from 'react';
import PrivacyPolicy from '../app/policy/policy';
import TermsOfService from '../app/terms/terms';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  ExternalLink,
} from 'lucide-react';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const quickLinks = [
    { name: 'Air Quality Map', href: '/' },
    { name: 'Trends & Analytics', href: '#trends' },
    { name: 'Get Alerts', href: '#alerts' },
    { name: 'Contact Us', href: '#feedback' },
  ];

  const resources = [
    { name: 'Health Advisory', href: '/health-advisory' },
    { name: 'Data Methodology', href: '/methodology' },
    { name: 'Research Publications', href: '/research' },
    { name: 'Educational Materials', href: '/education' },
  ];

  const govLinks = [
    { name: 'Ministry of Health', href: 'https://www.health.go.ke/', external: true },
    { name: 'Ministry of Environment', href: 'https://www.environment.go.ke/', external: true },
    { name: 'NEMA Kenya', href: 'https://www.nema.go.ke/', external: true },
    { name: 'County Government of Nairobi', href: 'https://www.nairobi.go.ke/', external: true }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/officialnairobicitycounty/', external: true, color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: Twitter, href: 'https://x.com/ccnairobi', external: true, color: 'hover:text-blue-400' },
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/nairobi_citycountygovernment/', external: true, color: 'hover:text-pink-600' },
    { name: 'YouTube', icon: Youtube, href: 'https://www.youtube.com/channel/UCZ7hZl4z1KU0N06LoTA3wbQ', external: true, color: 'hover:text-red-600' }
  ];

  return (
    <footer className={`bg-gray-800 text-white ${className}`}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Organization Info */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src="/nccg_logo.png" alt="Nairobi County Government" className="h-20 w-20" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Nairobi Air Quality Portal</h3>
                <p className="text-sm text-gray-400">County Government of Nairobi</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Real-time air quality monitoring across Nairobi to protect public health and environment through accurate data, research, and community engagement.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <MapPin size={16} className="text-green-400" />
                <span>City Hall, Nairobi, Kenya</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone size={16} className="text-green-400" />
                <span>+254 20 222 4126</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail size={16} className="text-green-400" />
                <span>environment@nairobi.go.ke</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock size={16} className="text-green-400" />
                <span>24/7 Real-time Monitoring</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">Resources</h4>
            <ul className="space-y-2">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a 
                    href={resource.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Government Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-400">Government Links</h4>
            <ul className="space-y-2">
              {govLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-200 flex items-center space-x-1"
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                  >
                    <span>{link.name}</span>
                    {link.external && <ExternalLink size={12} />}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Legal */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Social Media */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Follow us:</span>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`text-gray-400 ${social.color} transition-colors duration-200`}
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <a href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <span>|</span>
              <a href="/policy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <span>|</span>
              {/* <a href="/accessibility" className="hover:text-white transition-colors">
                Accessibility
              </a> */}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-900 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Nairobi County Government - Air Quality Portal. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span>Committed to Clean Air for All Nairobians</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;