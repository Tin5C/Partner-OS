// Customer Brief Section (Partner-only)
// Matches the Account Prep design pattern for consistency

import * as React from 'react';
import { useState } from 'react';
import { 
  Building2, 
  Sparkles,
  ChevronDown,
  Plus,
  X,
  Copy,
  CheckCircle2,
  AlertCircle,
  Users,
  DollarSign,
  FileText,
  Calendar,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { 
  PartnerBriefInput, 
  PartnerBriefOutput,
  generatePartnerBrief,
  DEAL_MOTIONS,
  INDUSTRIES,
  REGIONS,
  DEAL_SIZE_BANDS,
  TIMELINES,
  COMPETITORS,
  NEEDS_MOST,
} from '@/data/partnerBriefData';

export function CustomerBriefSection() {
  // Form state
  const [customerName, setCustomerName] = useState<string>('');
  const [dealMotion, setDealMotion] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [dealSizeBand, setDealSizeBand] = useState<string>('');
  const [timeline, setTimeline] = useState<string>('');
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [needsMost, setNeedsMost] = useState<string[]>([]);
  
  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<PartnerBriefOutput | null>(null);
  const [contextOpen, setContextOpen] = useState(false);
  const [showCustomerError, setShowCustomerError] = useState(false);

  const canGenerate = customerName.trim() && dealMotion;
  const hasContext = industry || region || dealSizeBand || timeline || competitors.length > 0 || needsMost.length > 0;

  const handleGenerate = () => {
    if (!customerName.trim()) {
      setShowCustomerError(true);
      return;
    }
    if (!dealMotion) return;
    
    setShowCustomerError(false);
    setIsGenerating(true);
    
    setTimeout(() => {
      const input: PartnerBriefInput = {
        customerName: customerName.trim(),
        dealMotion,
        industry: industry || undefined,
        region: region || undefined,
        dealSizeBand: dealSizeBand || undefined,
        timeline: timeline || undefined,
        competitors: competitors.length > 0 ? competitors : undefined,
        needsMost,
      };
      const result = generatePartnerBrief(input);
      setOutput(result);
      setIsGenerating(false);
    }, 1500);
  };

  const handleCustomerChange = (value: string) => {
    setCustomerName(value);
    setShowCustomerError(false);
  };

  const toggleCompetitor = (value: string) => {
    setCompetitors(prev =>
      prev.includes(value)
        ? prev.filter(c => c !== value)
        : [...prev, value]
    );
  };

  const toggleNeed = (value: string) => {
    setNeedsMost(prev =>
      prev.includes(value)
        ? prev.filter(n => n !== value)
        : [...prev, value]
    );
  };

  const handleCopySection = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleClearContext = () => {
    setIndustry('');
    setRegion('');
    setDealSizeBand('');
    setTimeline('');
    setCompetitors([]);
    setNeedsMost([]);
  };

  const handleReset = () => {
    setCustomerName('');
    setDealMotion('');
    setIndustry('');
    setRegion('');
    setDealSizeBand('');
    setTimeline('');
    setCompetitors([]);
    setNeedsMost([]);
    setOutput(null);
    setContextOpen(false);
  };

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Customer Brief</h2>
        <p className="text-sm text-muted-foreground">
          Enter your deal context — get the right programs, funding, assets, and steps.
        </p>
      </div>

      {/* Main Card */}
      <div className={cn(
        "rounded-2xl border border-border bg-card",
        "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]"
      )}>
        {/* Controls Bar */}
        <div className="p-5 border-b border-border/60">
          <div className="flex flex-col gap-4">
            {/* Row 1: Selectors */}
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Customer Name Input */}
              <div className="flex-1 lg:flex-initial lg:w-[220px]">
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    placeholder="Customer name..."
                    className={cn(
                      "w-full h-10 pl-9 pr-3 rounded-lg text-sm",
                      "bg-background border border-border",
                      "placeholder:text-muted-foreground/60",
                      "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30",
                      showCustomerError && "border-destructive ring-1 ring-destructive/30"
                    )}
                  />
                </div>
                {showCustomerError && (
                  <p className="mt-1.5 text-xs text-destructive">
                    Enter a customer name to generate brief.
                  </p>
                )}
              </div>

              {/* Deal Motion */}
              <Select value={dealMotion} onValueChange={setDealMotion}>
                <SelectTrigger className="w-full lg:w-[180px] h-10 bg-background border-border">
                  <SelectValue placeholder="Deal motion..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  {DEAL_MOTIONS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Deal Size */}
              <Select value={dealSizeBand} onValueChange={setDealSizeBand}>
                <SelectTrigger className="w-full lg:w-[140px] h-10 bg-background border-border">
                  <SelectValue placeholder="Deal size..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  {DEAL_SIZE_BANDS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className={cn(
                  "flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl",
                  "bg-primary text-primary-foreground font-medium text-sm",
                  "shadow-sm hover:bg-primary/90 transition-all",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "lg:ml-auto"
                )}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Brief
                  </>
                )}
              </button>
            </div>

            {/* Row 2: Context Toggle */}
            <Collapsible open={contextOpen} onOpenChange={setContextOpen} className="flex-1">
              <div className="flex items-center gap-3">
                <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  {contextOpen ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  Add context (optional)
                </CollapsibleTrigger>
                {hasContext && !contextOpen && (
                  <span className="text-xs text-primary">Context added</span>
                )}
              </div>
              
              <CollapsibleContent className="mt-4">
                <div className="space-y-4 p-4 rounded-xl bg-muted/20 border border-border/50">
                  {/* Row: Industry, Region, Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Industry
                      </label>
                      <Select value={industry} onValueChange={setIndustry}>
                        <SelectTrigger className="w-full h-9 bg-background border-border text-sm">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border border-border z-50">
                          {INDUSTRIES.map((i) => (
                            <SelectItem key={i.value} value={i.value}>{i.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Region
                      </label>
                      <Select value={region} onValueChange={setRegion}>
                        <SelectTrigger className="w-full h-9 bg-background border-border text-sm">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border border-border z-50">
                          {REGIONS.map((r) => (
                            <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                        Timeline
                      </label>
                      <Select value={timeline} onValueChange={setTimeline}>
                        <SelectTrigger className="w-full h-9 bg-background border-border text-sm">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border border-border z-50">
                          {TIMELINES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Competitors */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Primary Competitor(s)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {COMPETITORS.map((comp) => (
                        <button
                          key={comp.value}
                          type="button"
                          onClick={() => toggleCompetitor(comp.value)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                            'border',
                            competitors.includes(comp.value)
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-card text-foreground border-border hover:bg-secondary'
                          )}
                        >
                          {comp.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* What do you need most? */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                      What do you need most?
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {NEEDS_MOST.map((need) => (
                        <button
                          key={need.value}
                          type="button"
                          onClick={() => toggleNeed(need.value)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                            'border',
                            needsMost.includes(need.value)
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-card text-foreground border-border hover:bg-secondary'
                          )}
                        >
                          {need.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Context */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleClearContext}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Clear context
                    </button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Output Section */}
        {output && (
          <div className="p-5 space-y-5">
            {/* Top Recommendations */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Recommended Microsoft Support</h3>
              </div>
              <div className="space-y-2">
                {output.topRecommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg",
                      rec.priority === 'high' 
                        ? 'bg-primary/5 border border-primary/20' 
                        : 'bg-muted/30'
                    )}
                  >
                    <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{rec.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{rec.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Two Column Layout for Programs & Funding */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Programs & Eligibility */}
              <div className="rounded-xl border border-border bg-muted/10 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">Programs & Eligibility</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    {output.programs.coSell.recommended ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Co-Sell: {output.programs.coSell.recommended ? 'Recommended' : 'Optional'}
                      </p>
                      <p className="text-xs text-muted-foreground">{output.programs.coSell.notes}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    {output.programs.dealRegistration.recommended ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Deal Registration: {output.programs.dealRegistration.recommended ? 'Recommended' : 'Optional'}
                      </p>
                      <p className="text-xs text-muted-foreground">{output.programs.dealRegistration.notes}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Funding & Incentives */}
              <div className="rounded-xl border border-border bg-muted/10 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">Funding & Incentives</h3>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Workshop Funding</p>
                    <p className="text-sm text-foreground">{output.funding.workshopFunding}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">POC Support</p>
                    <p className="text-sm text-foreground">{output.funding.pocSupport}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Workshop Suggestion */}
            {output.workshop && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Suggested Workshop</h3>
                </div>
                <p className="text-sm font-medium text-primary mb-2">{output.workshop.name}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Agenda</p>
                    <ul className="space-y-1">
                      {output.workshop.agenda.map((item, idx) => (
                        <li key={idx} className="text-xs text-foreground flex items-start gap-2">
                          <span className="text-muted-foreground">{idx + 1}.</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Expected Outputs</p>
                    <ul className="space-y-1">
                      {output.workshop.expectedOutputs.map((out, idx) => (
                        <li key={idx} className="text-xs text-foreground flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          {out}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Who to Contact & Assets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Who to Contact */}
              <div className="rounded-xl border border-border bg-muted/10 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">Who to Contact</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {output.routing.contacts.map((contact, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-muted/50 rounded-md text-xs text-foreground"
                    >
                      {contact}
                    </span>
                  ))}
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Next Steps</p>
                  <ul className="space-y-1">
                    {output.routing.steps.map((step, idx) => (
                      <li key={idx} className="text-xs text-foreground">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Assets */}
              <div className="rounded-xl border border-border bg-muted/10 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">Assets to Use</h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {output.assets.map((asset, idx) => (
                    <button
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background transition-colors text-left"
                    >
                      <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{asset.name}</p>
                        <p className="text-[10px] text-muted-foreground">{asset.type}</p>
                      </div>
                      <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Next 7 Days */}
            <div className="rounded-xl border border-border bg-muted/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">Next 7 Days</h3>
                </div>
                <button
                  onClick={() => handleCopySection(`Next 7 Days:\n• ${output.nextSevenDays.join('\n• ')}`)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
              <div className="space-y-2">
                {output.nextSevenDays.map((action, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors"
                  >
                    <span className="w-5 h-5 rounded-full border border-border text-xs font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-foreground">{action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <button
                onClick={handleReset}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                New Brief
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopySection(JSON.stringify(output, null, 2))}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted/50 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!output && !isGenerating && (
          <div className="p-8 text-center">
            <Sparkles className="w-8 h-8 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              Enter a customer name and deal motion to generate your brief.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
