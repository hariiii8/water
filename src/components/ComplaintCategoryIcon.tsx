import React from 'react';
import {
  Droplets,
  DropletOff,
  Waves,
  Gauge,
  Wrench,
  ShieldAlert,
  AlertTriangle,
  HelpCircle,
  LucideIcon
} from 'lucide-react';
import { ProblemCategory } from '../types';

export interface CategoryMeta {
  id: ProblemCategory;
  label: string;
  shortDesc: string;
  icon: LucideIcon;
  gradient: string;
  glowColor: string;
  bgLight: string;
  textColor: string;
  borderColor: string;
  ringColor: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultUrgency: 'Low' | 'Medium' | 'High' | 'Emergency';
}

export const CATEGORY_DEFINITIONS: Record<string, CategoryMeta> = {
  'Water Leakage': {
    id: 'Water Leakage',
    label: 'Water Leakage',
    shortDesc: 'Pipe leaking water on the street',
    icon: Droplets,
    gradient: 'from-cyan-500 via-sky-500 to-blue-600',
    glowColor: 'rgba(6, 182, 212, 0.35)',
    bgLight: 'bg-cyan-50/80',
    textColor: 'text-cyan-800',
    borderColor: 'border-cyan-200/90',
    ringColor: 'ring-cyan-500',
    defaultTitle: 'Water leaking from pipe on street',
    defaultDescription: 'A water pipe is broken on the road and clean water is flowing out. Please fix it soon.',
    defaultUrgency: 'High'
  },
  'No Water': {
    id: 'No Water',
    label: 'No Water',
    shortDesc: 'No tap water today',
    icon: DropletOff,
    gradient: 'from-rose-500 via-red-500 to-pink-600',
    glowColor: 'rgba(244, 63, 94, 0.35)',
    bgLight: 'bg-rose-50/80',
    textColor: 'text-rose-800',
    borderColor: 'border-rose-200/90',
    ringColor: 'ring-rose-500',
    defaultTitle: 'No tap water today',
    defaultDescription: 'No water came from the tap today and our water tank is empty. Please check and restore water.',
    defaultUrgency: 'High'
  },
  'Dirty Water': {
    id: 'Dirty Water',
    label: 'Dirty Water',
    shortDesc: 'Muddy or brown tap water',
    icon: Waves,
    gradient: 'from-amber-500 via-orange-500 to-amber-600',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    bgLight: 'bg-amber-50/80',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-200/90',
    ringColor: 'ring-amber-500',
    defaultTitle: 'Tap water is brown and dirty',
    defaultDescription: 'Tap water came brown and muddy today. It is not safe to drink or cook with. Please check.',
    defaultUrgency: 'High'
  },
  'Slow Water Flow': {
    id: 'Slow Water Flow',
    label: 'Slow Water',
    shortDesc: 'Water comes out very slowly',
    icon: Gauge,
    gradient: 'from-sky-500 via-indigo-500 to-blue-700',
    glowColor: 'rgba(99, 102, 241, 0.35)',
    bgLight: 'bg-indigo-50/80',
    textColor: 'text-indigo-800',
    borderColor: 'border-indigo-200/90',
    ringColor: 'ring-indigo-500',
    defaultTitle: 'Water flow is very slow',
    defaultDescription: 'Water comes out in a thin trickle from the tap. It takes a long time to fill even one bucket.',
    defaultUrgency: 'Medium'
  },
  'Broken Tap': {
    id: 'Broken Tap',
    label: 'Broken Tap',
    shortDesc: 'Public street tap broken',
    icon: Wrench,
    gradient: 'from-teal-500 via-emerald-500 to-teal-700',
    glowColor: 'rgba(20, 184, 166, 0.35)',
    bgLight: 'bg-teal-50/80',
    textColor: 'text-teal-800',
    borderColor: 'border-teal-200/90',
    ringColor: 'ring-teal-500',
    defaultTitle: 'Street tap is broken',
    defaultDescription: 'A street water tap is damaged and water is leaking continuously. Please repair it.',
    defaultUrgency: 'Medium'
  },
  'Bad Smell or Taste': {
    id: 'Bad Smell or Taste',
    label: 'Bad Smell or Taste',
    shortDesc: 'Tap water smells bad',
    icon: ShieldAlert,
    gradient: 'from-purple-500 via-violet-600 to-fuchsia-600',
    glowColor: 'rgba(168, 85, 247, 0.35)',
    bgLight: 'bg-purple-50/80',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200/90',
    ringColor: 'ring-purple-500',
    defaultTitle: 'Tap water smells bad',
    defaultDescription: 'Tap water has a foul smell and unusual taste today. Please check the pipeline.',
    defaultUrgency: 'Emergency'
  },
  'Broken Pipe': {
    id: 'Broken Pipe',
    label: 'Broken Pipe',
    shortDesc: 'Main water pipe cracked',
    icon: Droplets,
    gradient: 'from-cyan-600 to-blue-700',
    glowColor: 'rgba(2, 132, 199, 0.35)',
    bgLight: 'bg-cyan-50/80',
    textColor: 'text-cyan-800',
    borderColor: 'border-cyan-200/90',
    ringColor: 'ring-cyan-500',
    defaultTitle: 'Broken water pipe on road',
    defaultDescription: 'Water pipe is broken on the road with heavy water leaking out.',
    defaultUrgency: 'Emergency'
  },
  'Other Problem': {
    id: 'Other Problem',
    label: 'Other Problem',
    shortDesc: 'Other water issue',
    icon: AlertTriangle,
    gradient: 'from-slate-600 via-slate-700 to-slate-800',
    glowColor: 'rgba(100, 116, 139, 0.35)',
    bgLight: 'bg-slate-100',
    textColor: 'text-slate-800',
    borderColor: 'border-slate-300',
    ringColor: 'ring-slate-500',
    defaultTitle: 'Water problem in area',
    defaultDescription: 'Reporting a water supply problem in our street.',
    defaultUrgency: 'Medium'
  }
};

export function getCategoryMeta(category: string): CategoryMeta {
  if (CATEGORY_DEFINITIONS[category]) {
    return CATEGORY_DEFINITIONS[category];
  }

  // Normalization checks
  const lower = category.toLowerCase();
  if (lower.includes('leak') || lower.includes('burst')) return CATEGORY_DEFINITIONS['Water Leakage'];
  if (lower.includes('no water')) return CATEGORY_DEFINITIONS['No Water'];
  if (lower.includes('dirty') || lower.includes('brown') || lower.includes('mud')) return CATEGORY_DEFINITIONS['Dirty Water'];
  if (lower.includes('slow') || lower.includes('pressure') || lower.includes('flow')) return CATEGORY_DEFINITIONS['Slow Water Flow'];
  if (lower.includes('tap')) return CATEGORY_DEFINITIONS['Broken Tap'];
  if (lower.includes('smell') || lower.includes('taste') || lower.includes('contamination')) return CATEGORY_DEFINITIONS['Bad Smell or Taste'];
  if (lower.includes('pipe')) return CATEGORY_DEFINITIONS['Broken Pipe'];

  return {
    id: 'Other Problem',
    label: category as ProblemCategory,
    shortDesc: 'Civic water issue',
    icon: HelpCircle,
    gradient: 'from-slate-600 via-slate-700 to-slate-800',
    glowColor: 'rgba(100, 116, 139, 0.3)',
    bgLight: 'bg-slate-100',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-200',
    ringColor: 'ring-slate-500',
    defaultTitle: category,
    defaultDescription: 'Municipal water grievance reported.',
    defaultUrgency: 'Medium'
  };
}

interface ComplaintCategoryIconProps {
  category: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  className?: string;
  glow?: boolean;
}

export const ComplaintCategoryIcon: React.FC<ComplaintCategoryIconProps> = ({
  category,
  size = 'md',
  showLabel = false,
  className = '',
  glow = false
}) => {
  const meta = getCategoryMeta(category);
  const Icon = meta.icon;

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl text-xs',
    md: 'w-10 h-10 rounded-2xl text-sm',
    lg: 'w-12 h-12 rounded-2xl text-base',
    xl: 'w-14 h-14 rounded-2xl text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className={`relative flex items-center justify-center shrink-0 bg-gradient-to-br ${meta.gradient} text-white shadow-sm ring-1 ring-white/25 transition-transform duration-200 ${sizeClasses[size]}`}
        style={glow ? { boxShadow: `0 4px 14px ${meta.glowColor}` } : undefined}
      >
        <Icon className={`${iconSizes[size]} stroke-[2.2] drop-shadow-xs`} />
      </div>
      {showLabel && (
        <span className={`font-bold tracking-tight text-xs sm:text-sm ${meta.textColor}`}>
          {meta.label}
        </span>
      )}
    </div>
  );
};
