// Partner Toolkit Section
// Microsoft Partner resources and tools for Partner space

import { useState } from 'react';
import { 
  Briefcase, 
  ChevronRight, 
  FileText, 
  Sparkles,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PartnerBriefForm } from './PartnerBriefForm';
import { PartnerBriefResult } from './PartnerBriefResult';
import { 
  PartnerBriefInput, 
  PartnerBriefOutput,
  generatePartnerBrief,
} from '@/data/partnerBriefData';

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
  onClick?: () => void;
  external?: boolean;
}

function ToolCard({ icon, title, description, badge, onClick, external }: ToolCardProps) {
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
      <div className={cn(
        "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
        "bg-primary/10"
      )}>
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-medium text-foreground">{title}</h4>
          {badge && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
          {description}
        </p>
      </div>

      {external ? (
        <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
      ) : (
        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
      )}
    </button>
  );
}

export function PartnerToolkit() {
  const [briefFormOpen, setBriefFormOpen] = useState(false);
  const [briefResultOpen, setBriefResultOpen] = useState(false);
  const [briefInput, setBriefInput] = useState<PartnerBriefInput | null>(null);
  const [briefOutput, setBriefOutput] = useState<PartnerBriefOutput | null>(null);

  const handleBriefSubmit = (data: PartnerBriefInput) => {
    setBriefInput(data);
    const output = generatePartnerBrief(data);
    setBriefOutput(output);
    setBriefFormOpen(false);
    setBriefResultOpen(true);
  };

  const handleNewBrief = () => {
    setBriefResultOpen(false);
    setBriefFormOpen(true);
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Microsoft Partner Toolkit
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Resources and tools to accelerate your Microsoft partnership.
        </p>
      </div>

      {/* Featured: Partner Brief */}
      <div 
        onClick={() => setBriefFormOpen(true)}
        className={cn(
          "flex items-start gap-4 p-5 rounded-xl cursor-pointer",
          "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent",
          "border border-primary/20",
          "hover:border-primary/40 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
          "transition-all duration-200"
        )}
      >
        <div className={cn(
          "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
          "bg-primary text-primary-foreground"
        )}>
          <Sparkles className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-foreground">Partner Brief</h3>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium">
              NEW
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your deal context — get the right programs, funding, assets, and steps.
          </p>
        </div>

        <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
      </div>

      {/* Other Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ToolCard
          icon={<FileText className="w-4 h-4 text-primary" />}
          title="Partner Center"
          description="Manage deals, registrations, and incentives."
          external
          onClick={() => window.open('https://partner.microsoft.com', '_blank')}
        />
        <ToolCard
          icon={<BookOpen className="w-4 h-4 text-primary" />}
          title="Solution Playbooks"
          description="Guides for each Microsoft solution area."
          onClick={() => {}}
        />
        <ToolCard
          icon={<Briefcase className="w-4 h-4 text-primary" />}
          title="Co-Sell Resources"
          description="Assets and guidance for co-sell motions."
          onClick={() => {}}
        />
        <ToolCard
          icon={<Sparkles className="w-4 h-4 text-primary" />}
          title="Workshop-in-a-Box"
          description="Pre-built workshop templates and materials."
          onClick={() => {}}
        />
      </div>

      {/* Modals */}
      <PartnerBriefForm
        open={briefFormOpen}
        onOpenChange={setBriefFormOpen}
        onSubmit={handleBriefSubmit}
      />

      <PartnerBriefResult
        open={briefResultOpen}
        onOpenChange={setBriefResultOpen}
        input={briefInput}
        output={briefOutput}
        onNewBrief={handleNewBrief}
      />
    </section>
  );
}
