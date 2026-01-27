import { useState } from 'react';
import { Clock, Calendar, Headphones, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AccountPrepWizard, AccountPrepData } from './AccountPrepWizard';
import { AccountPrepResult } from './AccountPrepResult';

interface AccountPrepCardProps {
  className?: string;
}

export function AccountPrepCard({ className }: AccountPrepCardProps) {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [prepResult, setPrepResult] = useState<AccountPrepData | null>(null);

  const handleGenerate = (data: AccountPrepData) => {
    setPrepResult(data);
  };

  const handleNewPrep = () => {
    setPrepResult(null);
    setWizardOpen(true);
  };

  const handleCloseResult = () => {
    setPrepResult(null);
  };

  // If we have a result, show that instead of the card
  if (prepResult) {
    return (
      <AccountPrepResult
        data={prepResult}
        onClose={handleCloseResult}
        onNewPrep={handleNewPrep}
      />
    );
  }

  return (
    <>
      <div
        className={cn(
          'relative flex flex-col p-5 rounded-2xl text-left',
          'bg-card border border-border shadow-card',
          'hover:shadow-card-hover transition-all duration-200',
          className
        )}
      >
        {/* Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-soft bg-emerald-100 dark:bg-emerald-900/40">
            <Calendar className="w-5 h-5 text-foreground/70" />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-body mb-1 text-foreground">
          Account Prep
        </h3>

        {/* Subtitle */}
        <p className="text-caption text-muted-foreground line-clamp-1 mb-4">
          Generate a meeting-ready prep pack
        </p>

        {/* Footer: Time + Tag */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 text-caption text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            ~2 min
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-card text-caption text-muted-foreground border border-border shadow-chip">
            Pre-meeting
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-border">
          <button
            onClick={() => setWizardOpen(true)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium',
              'bg-primary text-primary-foreground shadow-soft',
              'hover:bg-primary/90 hover:shadow-card active:scale-[0.98] transition-all duration-200'
            )}
          >
            <Headphones className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Generate Prep</span>
          </button>
          <button
            onClick={() => setWizardOpen(true)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-medium',
              'bg-card text-secondary-foreground border border-border shadow-chip',
              'hover:bg-secondary hover:shadow-card active:scale-[0.98] transition-all duration-200'
            )}
          >
            <FileText className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Exec Summary</span>
          </button>
        </div>
      </div>

      <AccountPrepWizard
        open={wizardOpen}
        onOpenChange={setWizardOpen}
        onGenerate={handleGenerate}
      />
    </>
  );
}
