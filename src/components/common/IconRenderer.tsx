import React from 'react';
import * as Icons from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-5 h-5', size = 20 }) => {
  // Normalize icon name
  const cleanName = name?.trim() || 'Code';
  const LucideIcon = (Icons as any)[cleanName] || (Icons as any)[cleanName.charAt(0).toUpperCase() + cleanName.slice(1)] || Icons.Code;

  return <LucideIcon className={className} size={size} />;
};
