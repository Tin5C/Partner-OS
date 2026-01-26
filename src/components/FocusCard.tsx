import { Clock, Building2, Radar, Newspaper, MessageCircle, User, BookOpen, Headphones, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FocusCard as FocusCardType } from '@/lib/focusCards';
import userAvatar from '@/assets/user-avatar.jpg';

// Logo imports
import sulzerLogo from '@/assets/logos/sulzer.png';
import awsLogo from '@/assets/logos/aws.png';
import gcpLogo from '@/assets/logos/gcp.png';
import azureLogo from '@/assets/logos/azure.png';
import mckinseyLogo from '@/assets/logos/mckinsey.png';
import gartnerLogo from '@/assets/logos/gartner.png';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'building-2': Building2,
  'radar': Radar,
  'newspaper': Newspaper,
  'message-circle': MessageCircle,
  'user-circle': User,
  'book-open': BookOpen,
};

const logoMap: Record<string, string> = {
  sulzer: sulzerLogo,
  aws: awsLogo,
  gcp: gcpLogo,
  azure: azureLogo,
  mckinsey: mckinseyLogo,
  gartner: gartnerLogo,
};

// Muted background colors per tile type - no gradients, solid only
const tileColors: Record<string, { bg: string; iconBg: string }> = {
  'top-focus-sulzer': { bg: 'bg-blue-50 dark:bg-blue-950/30', iconBg: 'bg-blue-100 dark:bg-blue-900/50' },
  'competitive-radar': { bg: 'bg-rose-50 dark:bg-rose-950/30', iconBg: 'bg-rose-100 dark:bg-rose-900/50' },
  'industry-news-manufacturing': { bg: 'bg-amber-50 dark:bg-amber-950/30', iconBg: 'bg-amber-100 dark:bg-amber-900/50' },
  'objection-handling': { bg: 'bg-purple-50 dark:bg-purple-950/30', iconBg: 'bg-purple-100 dark:bg-purple-900/50' },
  'personal-brand-daniel': { bg: 'bg-violet-50 dark:bg-violet-950/30', iconBg: 'bg-violet-100 dark:bg-violet-900/50' },
  'book-briefings': { bg: 'bg-teal-50 dark:bg-teal-950/30', iconBg: 'bg-teal-100 dark:bg-teal-900/50' },
};

interface FocusCardProps {
  card: FocusCardType;
  onListen: () => void;
  onRead: () => void;
  className?: string;
}

export function FocusCardComponent({ card, onListen, onRead, className }: FocusCardProps) {
  const Icon = iconMap[card.icon] || Building2;
  const colors = tileColors[card.id] || { bg: 'bg-muted/50', iconBg: 'bg-muted' };
  const isPersonalBrand = card.id === 'personal-brand-daniel';
  const hasLogos = card.logos && card.logos.length > 0;

  return (
    <div
      className={cn(
        'relative flex flex-col p-4 rounded-xl text-left',
        'border border-border/50',
        colors.bg,
        className
      )}
    >
      {/* Icon or User Photo */}
      <div className="flex items-start justify-between mb-3">
        {isPersonalBrand ? (
          <img 
            src={userAvatar} 
            alt="Your profile" 
            className="w-10 h-10 rounded-full object-cover ring-2 ring-violet-200 dark:ring-violet-800"
          />
        ) : (
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            colors.iconBg
          )}>
            <Icon className="w-5 h-5 text-foreground/70" />
          </div>
        )}
        
        {/* Logos row - positioned top right */}
        {hasLogos && (
          <div className="flex items-center -space-x-1">
            {card.logos!.slice(0, 3).map((logoId, idx) => (
              <div 
                key={logoId}
                className="w-6 h-6 rounded-full bg-white border border-border/30 flex items-center justify-center overflow-hidden shadow-sm"
                style={{ zIndex: 3 - idx }}
              >
                <img 
                  src={logoMap[logoId]} 
                  alt={logoId} 
                  className="w-4 h-4 object-contain"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Title - Primary */}
      <h3 className="font-semibold text-sm mb-1 text-foreground">{card.title}</h3>
      
      {/* Subtitle - Secondary */}
      <p className="text-xs text-muted-foreground line-clamp-1 mb-3">
        {card.subtitle}
      </p>

      {/* Footer: Time + Tag */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {card.timeEstimate}
        </span>
        {card.tags.slice(0, 1).map((tag, idx) => (
          <span 
            key={idx}
            className="px-2 py-0.5 rounded-full bg-background/80 text-xs text-muted-foreground border border-border/50"
          >
            {tag.value}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border/30">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onListen();
          }}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[11px] font-medium',
            'bg-primary text-primary-foreground',
            'hover:bg-primary/90 active:scale-[0.98] transition-all duration-150'
          )}
        >
          <Headphones className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">Listen Briefing</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRead();
          }}
          className={cn(
            'flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[11px] font-medium',
            'bg-secondary text-secondary-foreground',
            'hover:bg-secondary/80 active:scale-[0.98] transition-all duration-150'
          )}
        >
          <FileText className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">Exec Summary</span>
        </button>
      </div>
    </div>
  );
}
