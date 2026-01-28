import { useState } from 'react';
import { Globe, TrendingUp, Calendar, Linkedin, Link2, Pencil, Trash2, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PresenceData } from '@/lib/presenceConfig';
import { format } from 'date-fns';

interface PresenceDashboardProps {
  presence: PresenceData;
  onEdit: () => void;
  onRemoveSource: (source: 'linkedin' | 'blog' | 'medium' | 'github' | 'newsletter') => void;
  className?: string;
}

interface InsightCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  lastUpdated?: string;
  onClick?: () => void;
}

function InsightCard({ icon, title, description, lastUpdated, onClick }: InsightCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl text-left w-full",
        "bg-card border border-border",
        "shadow-[0_1px_2px_rgba(0,0,0,0.03)]",
        "hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
        "hover:border-border/80",
        "transition-all duration-200"
      )}
    >
      {/* Icon */}
      <div className={cn(
        "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
        "bg-muted/50"
      )}>
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
          {description}
        </p>
        {lastUpdated && (
          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground mt-1.5">
            <Clock className="w-3 h-3" />
            Updated {lastUpdated}
          </span>
        )}
      </div>

      {/* Arrow */}
      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
    </button>
  );
}

export function PresenceDashboard({ 
  presence, 
  onEdit, 
  onRemoveSource,
  className 
}: PresenceDashboardProps) {
  const [showSources, setShowSources] = useState(false);

  const allSources: { key: 'linkedin' | 'blog' | 'medium' | 'github' | 'newsletter'; label: string; value?: string; icon: React.ReactNode }[] = [
    { key: 'linkedin', label: 'LinkedIn', value: presence.linkedinUrl || (presence.linkedinPdfUploaded ? 'PDF uploaded' : undefined), icon: <Linkedin className="w-3.5 h-3.5" /> },
    { key: 'blog', label: 'Blog', value: presence.blogUrl, icon: <Globe className="w-3.5 h-3.5" /> },
    { key: 'medium', label: 'Medium', value: presence.mediumUrl, icon: <Link2 className="w-3.5 h-3.5" /> },
    { key: 'github', label: 'GitHub', value: presence.githubUrl, icon: <Link2 className="w-3.5 h-3.5" /> },
    { key: 'newsletter', label: 'Newsletter', value: presence.newsletterUrl, icon: <Link2 className="w-3.5 h-3.5" /> },
  ];
  
  const sources = allSources.filter((s): s is typeof s & { value: string } => !!s.value);

  const lastUpdatedFormatted = presence.lastUpdated 
    ? format(new Date(presence.lastUpdated), 'MMM d')
    : undefined;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Insight Cards */}
      <div className="space-y-2">
        <InsightCard
          icon={<Globe className="w-4 h-4 text-muted-foreground" />}
          title="Market Presence"
          description="Your visibility score and improvement tips"
          lastUpdated={lastUpdatedFormatted}
        />
        
        {/* Only show if goals include relevant items */}
        {presence.goals.includes('consistent-posting') && (
          <InsightCard
            icon={<Calendar className="w-4 h-4 text-muted-foreground" />}
            title="Consistency"
            description="Track your posting streak"
          />
        )}
        
        {presence.goals.includes('thought-leadership') && (
          <InsightCard
            icon={<TrendingUp className="w-4 h-4 text-muted-foreground" />}
            title="Recommended to Share"
            description="Content aligned with your expertise"
          />
        )}
      </div>

      {/* Sources Section */}
      {sources.length > 0 && (
        <div className="pt-2">
          <button
            onClick={() => setShowSources(!showSources)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>{sources.length} source{sources.length > 1 ? 's' : ''} connected</span>
            <ChevronRight className={cn(
              "w-3 h-3 transition-transform",
              showSources && "rotate-90"
            )} />
          </button>

          {showSources && (
            <div className="mt-2 space-y-1.5 pl-1">
              {sources.map((source) => (
                <div 
                  key={source.key}
                  className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-muted-foreground">{source.icon}</span>
                    <span className="text-xs text-foreground truncate max-w-[180px]">
                      {source.key === 'linkedin' && presence.linkedinPdfUploaded && !presence.linkedinUrl 
                        ? 'PDF uploaded' 
                        : source.value}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveSource(source.key)}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors mt-2"
              >
                <Pencil className="w-3 h-3" />
                Edit sources
              </button>
            </div>
          )}
        </div>
      )}

      {/* Goals Display */}
      {presence.goals.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {presence.goals.map((goal) => (
            <span
              key={goal}
              className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
            >
              {goal.replace('-', ' ')}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
