import React from 'react';
import { 
  Bot, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Upload,
  PenLine,
  Settings,
  Layers,
  Clock,
  Thermometer
} from 'lucide-react';

export const ICON_MAP: Record<string, React.ElementType> = {
  Bot,
  Image: ImageIcon,
  Video,
  Music,
  Upload,
  PenLine,
  Settings,
  Layers,
  Clock,
  Thermometer,
  Banana: ImageIcon // Fallback
};

interface DynamicIconProps {
  name?: string;
  size?: number;
  className?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, size = 16, className }) => {
  if (!name) return null;
  const Icon = ICON_MAP[name] || ImageIcon;
  return <Icon size={size} className={className} />;
};

