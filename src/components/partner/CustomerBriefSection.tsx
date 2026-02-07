// AI Deal Brief Section (Partner-only)
// Template-driven input/output with persona-specific rendering
// Supports: Seller vs Engineer persona, template-driven maturity scoring
// Supports: Entire account vs Specific area, Guided vs Brainstorm modes

import * as React from 'react';
import { useState, useMemo } from 'react';
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
  Target,
  TrendingUp,
  Lightbulb,
  Upload,
  Link2,
  Globe,
  Layers,
  Zap,
  Brain,
  Shield,
  Gauge,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  PartnerBriefInput, 
  PartnerBriefOutput,
  SignalCoverage,
  CaptureAction,
  ConditionalRefinement,
  ExtractedSignals,
  EvidenceState,
  BriefScope,
  InputMode,
  PersonaType,
  AIOpportunity,
  AIReadinessScore,
  SellerOutput,
  EngineerOutput,
  generatePartnerBrief,
  DEAL_MOTIONS,
  DEAL_SIZE_BANDS,
} from '@/data/partnerBriefData';
import {
  BriefTemplateId,
  BriefTemplateDefinition,
  BRIEF_TEMPLATE_DEFINITIONS,
  computeMaturityScore,
  MaturityScore,
} from '@/data/briefTemplates';
import { partnerBriefTemplates } from '@/config/spaces/partner';
import { EvidenceUploadBlock } from './EvidenceUploadBlock';
import { ExtractedSignalsBlock } from './ExtractedSignalsBlock';
import { ContextRequestCard } from './ContextRequestCard';
import { BriefBucketInput } from './BriefBucketInput';
import { BriefReadinessCard } from './BriefReadinessCard';
import { BriefTemplateSelector } from './BriefTemplateSelector';
import { savePartnerBriefContext } from './ExpertCornersRail';
import { RecommendedPackages } from './packages/RecommendedPackages';

// Helper to derive maturity gaps from brief output for package recommendations
function getMaturityGapsFromOutput(output: PartnerBriefOutput): Record<string, number> {
  const gaps: Record<string, number> = {};
  // Map AI readiness checklist to dimension scores
  const categoryMap: Record<string, string> = {
    'Applications': 'apps-deployment',
    'AI Vendor': 'ai-vendor-maturity',
    'Organization': 'org-readiness',
    'Data': 'data-readiness',
    'Governance': 'governance-risk',
    'Platform': 'platform-delivery',
    'Use Cases': 'use-cases',
    'Procurement': 'procurement',
  };

  for (const item of output.aiReadiness.missingChecklist) {
    const dimKey = categoryMap[item.category] || item.category.toLowerCase().replace(/ /g, '-');
    if (!item.filled) {
      gaps[dimKey] = Math.min(gaps[dimKey] ?? 0, 0); // unknown
    } else {
      gaps[dimKey] = Math.max(gaps[dimKey] ?? 0, 2); // defined
    }
  }

  // If readiness score is low, most dimensions are likely unknown/ad-hoc
  if (output.aiReadiness.score < 40) {
    for (const key of Object.values(categoryMap)) {
      if (!(key in gaps)) gaps[key] = 0;
    }
  }

  return gaps;
}

// Default empty evidence state
const createEmptyEvidence = (): EvidenceState => ({
  uploads: [],
  links: [],
  extractedSignals: { applications: [], architecture: [], licenses: [] },
});

// Segmented control component
function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}) {
  return (
    <div className={cn("inline-flex rounded-lg bg-muted/50 p-0.5 border border-border", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
            value === option.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function CustomerBriefSection() {
  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState<BriefTemplateId>(
    partnerBriefTemplates.default
  );

  // Available templates from config
  const availableTemplates = useMemo(() => {
    return partnerBriefTemplates.available
      .map((id) => BRIEF_TEMPLATE_DEFINITIONS[id])
      .filter(Boolean);
  }, []);

  const currentTemplate = BRIEF_TEMPLATE_DEFINITIONS[selectedTemplate];

  // Scope, Mode & Persona state
  const [briefScope, setBriefScope] = useState<BriefScope>('entire-account');
  const [specificArea, setSpecificArea] = useState<string>('');
  const [inputMode, setInputMode] = useState<InputMode>('guided');
  const [personaType, setPersonaType] = useState<PersonaType>('seller');
  const [brainstormNotes, setBrainstormNotes] = useState<string>('');
  
  // Template-driven bucket notes (keyed by bucket.id)
  const [bucketNotes, setBucketNotes] = useState<Record<string, string>>({});

  // Form state (guided mode — core fields)
  const [customerName, setCustomerName] = useState<string>('');
  const [dealMotion, setDealMotion] = useState<string>('');
  const [dealSizeBand, setDealSizeBand] = useState<string>('');

  // Evidence state
  const [evidence, setEvidence] = useState<EvidenceState>(createEmptyEvidence());
  
  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<PartnerBriefOutput | null>(null);
  const [bucketsOpen, setBucketsOpen] = useState(false);
  const [showCustomerError, setShowCustomerError] = useState(false);
  const [editedSignals, setEditedSignals] = useState<ExtractedSignals | null>(null);
  const [colleagueNotes, setColleagueNotes] = useState<string>('');

  // Validation logic
  const canGenerate = inputMode === 'brainstorm' 
    ? customerName.trim() && brainstormNotes.trim()
    : customerName.trim() && dealMotion;
  
  const filledBucketCount = Object.values(bucketNotes).filter(v => v.trim()).length;
  const hasEvidence = evidence.uploads.length > 0 || evidence.links.length > 0;

  // Compute maturity score in real-time
  const maturityScore = useMemo(() => {
    const evidenceBucketIds = new Set<string>();
    if (hasEvidence) {
      evidenceBucketIds.add('apps-deployment');
      evidenceBucketIds.add('data-readiness');
    }
    return computeMaturityScore(selectedTemplate, bucketNotes, evidenceBucketIds);
  }, [selectedTemplate, bucketNotes, hasEvidence]);

  const handleBucketNote = (bucketId: string, value: string) => {
    setBucketNotes(prev => ({ ...prev, [bucketId]: value }));
  };

  const handleGenerate = () => {
    if (!customerName.trim()) {
      setShowCustomerError(true);
      return;
    }
    if (inputMode === 'guided' && !dealMotion) return;
    if (inputMode === 'brainstorm' && !brainstormNotes.trim()) return;
    
    setShowCustomerError(false);
    setIsGenerating(true);
    
    setTimeout(() => {
      // Merge bucket notes into a brainstorm-style string for the existing engine
      const bucketText = Object.entries(bucketNotes)
        .filter(([_, v]) => v.trim())
        .map(([k, v]) => {
          const bucket = currentTemplate.inputBuckets.find(b => b.id === k);
          return `[${bucket?.label || k}]: ${v}`;
        })
        .join('\n');

      const combinedNotes = [
        inputMode === 'brainstorm' ? brainstormNotes : '',
        bucketText,
        colleagueNotes ? `\n--- Colleague notes ---\n${colleagueNotes}` : '',
      ].filter(Boolean).join('\n');

      const input: PartnerBriefInput = {
        customerName: customerName.trim(),
        dealMotion: inputMode === 'brainstorm' ? 'other' : dealMotion,
        dealSizeBand: dealSizeBand || undefined,
        // Derive signals from bucket notes for the existing engine
        applicationLandscape: bucketNotes['apps-deployment'] ? 'mixed' : undefined,
        cloudFootprint: bucketNotes['platform-delivery'] ? 'hybrid' : undefined,
        knownLicenses: bucketNotes['procurement'] ? 'm365-e5' : undefined,
        painPoints: bucketNotes['use-cases'] || undefined,
        needsMost: [],
        evidence: hasEvidence ? evidence : undefined,
        brainstormNotes: combinedNotes || undefined,
        briefScope,
        specificArea: briefScope === 'specific-area' ? specificArea : undefined,
        inputMode,
        personaType,
        aiUseCases: bucketNotes['use-cases'] || undefined,
        aiConstraints: bucketNotes['governance-risk'] ? ['security', 'governance'] : undefined,
        aiConstraintNotes: bucketNotes['governance-risk'] || undefined,
      };
      const result = generatePartnerBrief(input);
      setOutput(result);
      setEditedSignals(result.extractedSignals);
      setIsGenerating(false);
      
      savePartnerBriefContext(input);
    }, 1500);
  };

  const handleCustomerChange = (value: string) => {
    setCustomerName(value);
    setShowCustomerError(false);
  };

  const handleCopySection = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleAskColleagueForBucket = (tag: string) => {
    toast.info(`"Ask colleague" pre-tagged: ${tag}`);
  };

  const handleReset = () => {
    setCustomerName('');
    setDealMotion('');
    setDealSizeBand('');
    setEvidence(createEmptyEvidence());
    setBrainstormNotes('');
    setSpecificArea('');
    setBriefScope('entire-account');
    setInputMode('guided');
    setPersonaType('seller');
    setBucketNotes({});
    setOutput(null);
    setEditedSignals(null);
    setBucketsOpen(false);
    setColleagueNotes('');
  };

  const getCaptureIcon = (category: CaptureAction['category']) => {
    switch (category) {
      case 'seller': return <Target className="w-3 h-3 text-primary" />;
      case 'upload': return <Upload className="w-3 h-3 text-blue-500" />;
      case 'public': return <Globe className="w-3 h-3 text-green-600" />;
    }
  };

  const getEffortBadge = (effort: AIOpportunity['effortVsImpact']) => {
    switch (effort) {
      case 'Low': return <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded">Low effort</span>;
      case 'Medium': return <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">Medium effort</span>;
      case 'High': return <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded">High effort</span>;
    }
  };

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          {currentTemplate.label}
        </h2>
        <p className="text-sm text-muted-foreground">
          {currentTemplate.shortDescription}
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
            {/* Row 0: Template selector + Scope + Persona */}
            <div className="flex flex-wrap items-center gap-4">
              <BriefTemplateSelector
                value={selectedTemplate}
                onChange={setSelectedTemplate}
                availableTemplates={availableTemplates}
              />
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Scope</span>
                <SegmentedControl<BriefScope>
                  value={briefScope}
                  onChange={(v) => setBriefScope(v)}
                  options={[
                    { value: 'entire-account', label: 'Entire account' },
                    { value: 'specific-area', label: 'Specific area' },
                  ]}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Persona</span>
                <SegmentedControl<PersonaType>
                  value={personaType}
                  onChange={(v) => setPersonaType(v)}
                  options={[
                    { value: 'seller', label: 'Seller' },
                    { value: 'engineer', label: 'Engineer' },
                  ]}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Input</span>
                <SegmentedControl<InputMode>
                  value={inputMode}
                  onChange={(v) => setInputMode(v)}
                  options={[
                    { value: 'guided', label: 'Guided' },
                    { value: 'brainstorm', label: 'Brainstorm' },
                  ]}
                />
              </div>
            </div>

            {/* Specific Area Input (conditional) */}
            {briefScope === 'specific-area' && (
              <div className="flex-1">
                <input
                  type="text"
                  value={specificArea}
                  onChange={(e) => setSpecificArea(e.target.value)}
                  placeholder="What should we focus on? e.g., Customer engagement platform, SAP migration, Security posture..."
                  className={cn(
                    "w-full h-9 px-3 rounded-lg text-sm",
                    "bg-muted/30 border border-border",
                    "placeholder:text-muted-foreground/60",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                  )}
                />
              </div>
            )}

            {/* Row 1: Customer + Deal Motion + Generate */}
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

              {/* Guided Mode: Deal Motion & Size */}
              {inputMode === 'guided' && (
                <>
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
                </>
              )}

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

            {/* Brainstorm Mode: Free-form Input */}
            {inputMode === 'brainstorm' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-primary" />
                    Paste what you know
                  </label>
                  <p className="text-[11px] text-muted-foreground mb-2">
                    Licenses, apps, architecture hints, constraints — rough notes are fine.
                  </p>
                  <Textarea
                    value={brainstormNotes}
                    onChange={(e) => setBrainstormNotes(e.target.value)}
                    placeholder="M365 E3 for ~8k users, some E5. Azure EA. SAP ECC → S/4. Salesforce Sales Cloud. Customer engagement platform: custom portal + APIs, some Dynamics, security concerns..."
                    className="min-h-[100px] text-sm resize-none"
                  />
                </div>
                
                {/* Evidence Upload in Brainstorm Mode */}
                <EvidenceUploadBlock
                  evidence={evidence}
                  onEvidenceChange={setEvidence}
                />
              </div>
            )}

            {/* Guided Mode: Template-Driven Checklist Buckets */}
            {inputMode === 'guided' && (
              <Collapsible open={bucketsOpen} onOpenChange={setBucketsOpen} className="flex-1">
                <div className="flex items-center gap-3">
                  <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {bucketsOpen ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                    Add context ({currentTemplate.inputBuckets.length} areas)
                  </CollapsibleTrigger>
                  {filledBucketCount > 0 && !bucketsOpen && (
                    <span className="text-xs text-primary">
                      {filledBucketCount}/{currentTemplate.inputBuckets.length} filled
                    </span>
                  )}
                </div>
                
                <CollapsibleContent className="mt-4">
                  <div className="space-y-2">
                    {currentTemplate.inputBuckets.map((bucket) => (
                      <BriefBucketInput
                        key={bucket.id}
                        bucket={bucket}
                        notes={bucketNotes[bucket.id] || ''}
                        onNotesChange={(v) => handleBucketNote(bucket.id, v)}
                        onAskColleague={handleAskColleagueForBucket}
                      />
                    ))}

                    {/* Evidence Upload Section */}
                    <div className="pt-3 border-t border-border/50">
                      <EvidenceUploadBlock
                        evidence={evidence}
                        onEvidenceChange={setEvidence}
                      />
                    </div>

                    {/* Clear All */}
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setBucketNotes({})}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Clear context
                      </button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Context Request — lightweight "Missing context?" card */}
            <ContextRequestCard
              customerName={customerName}
              meetingContext={briefScope === 'specific-area' ? specificArea : undefined}
              colleagueNotes={colleagueNotes}
              onColleagueNotes={setColleagueNotes}
              hasNewContext={colleagueNotes.trim().length > 0}
            />
          </div>
        </div>

        {/* Output Section */}
        {output && (
          <div className="p-5 space-y-5">
            {/* Scope Header (if specific area) */}
            {output.briefScope === 'specific-area' && output.specificArea && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
                <Layers className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Scope: {output.specificArea}
                </span>
              </div>
            )}

            {/* Mode disclaimer for Brainstorm */}
            {output.inputMode === 'brainstorm' && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/50 border border-amber-200/50">
                <Zap className="w-4 h-4 text-amber-600" />
                <span className="text-xs text-amber-700">
                  Generated from pasted notes and extracted signals.
                </span>
              </div>
            )}

            {/* Signal Coverage Block */}
            <div className="rounded-xl border border-border bg-muted/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Signal Coverage</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    output.signalCoverage.confidence === 'High' && "bg-green-100 text-green-700",
                    output.signalCoverage.confidence === 'Medium' && "bg-amber-100 text-amber-700",
                    output.signalCoverage.confidence === 'Low' && "bg-red-100 text-red-700"
                  )}>
                    {output.signalCoverage.confidence} confidence
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <Progress value={output.signalCoverage.score} className="h-2" />
                </div>
                <span className="text-lg font-semibold text-foreground w-16 text-right">
                  {output.signalCoverage.score}/100
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 rounded-lg bg-background/50">
                  <p className="text-xs text-muted-foreground">Seller Known</p>
                  <p className="text-sm font-medium text-foreground">
                    {output.signalCoverage.breakdown.sellerKnown.score}/{output.signalCoverage.breakdown.sellerKnown.max}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-background/50">
                  <p className="text-xs text-muted-foreground">Evidence</p>
                  <p className="text-sm font-medium text-foreground">
                    {output.signalCoverage.breakdown.evidenceUploads.score}/{output.signalCoverage.breakdown.evidenceUploads.max}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-background/50">
                  <p className="text-xs text-muted-foreground">Public Signals</p>
                  <p className="text-sm font-medium text-foreground">
                    {output.signalCoverage.breakdown.publicSignals.score}/{output.signalCoverage.breakdown.publicSignals.max}
                  </p>
                </div>
              </div>
            </div>

            {/* Extracted Signals Block */}
            {editedSignals && (
              <ExtractedSignalsBlock
                signals={editedSignals}
                onSignalsChange={setEditedSignals}
              />
            )}

            {/* Capture Plan */}
            {output.capturePlan.length > 0 && (
              <div className="rounded-xl border border-border bg-muted/10 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Capture Plan</h3>
                  <span className="text-xs text-muted-foreground">(to reach 80+ quickly)</span>
                </div>
                <div className="space-y-2">
                  {output.capturePlan.map((action, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-2 rounded-lg bg-background/50"
                    >
                      <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                        {getCaptureIcon(action.category)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{action.action}</p>
                        <p className="text-xs text-muted-foreground">{action.timeEstimate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Template-Driven Readiness Card */}
            <BriefReadinessCard
              score={maturityScore}
              templateLabel={currentTemplate.label}
            />

            {/* Seller-specific output */}
            {output.sellerOutput && (
              <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Seller Brief</h3>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Use case & outcome</p>
                  <p className="text-sm text-foreground">{output.sellerOutput.useCaseOutcome}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Value framing</p>
                  <p className="text-sm text-foreground">{output.sellerOutput.valueFraming}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Talk track</p>
                  <div className="space-y-1.5">
                    {output.sellerOutput.talkTrack.map((line, idx) => (
                      <p key={idx} className="text-sm text-foreground italic">{line}</p>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">AI objections & responses</p>
                  <div className="space-y-2">
                    {output.sellerOutput.objections.map((obj, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-background/50">
                        <p className="text-xs font-medium text-foreground mb-1">"{obj.objection}"</p>
                        <p className="text-xs text-muted-foreground">{obj.response}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Pilot path</p>
                  <div className="space-y-1">
                    {output.sellerOutput.pilotPath.map((step, idx) => (
                      <p key={idx} className="text-xs text-foreground">{step}</p>
                    ))}
                  </div>
                </div>
                {output.sellerOutput.followUpEmail && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-muted-foreground">Follow-up email draft</p>
                      <button
                        onClick={() => handleCopySection(output.sellerOutput?.followUpEmail || '')}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed p-3 rounded-lg bg-background/50 max-h-[200px] overflow-y-auto">
                      {output.sellerOutput.followUpEmail}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Engineer-specific output */}
            {output.engineerOutput && (
              <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Engineer Brief</h3>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Assumptions & open questions</p>
                  <ul className="space-y-1">
                    {output.engineerOutput.assumptions.map((a, idx) => (
                      <li key={idx} className="text-xs text-foreground flex items-start gap-2">
                        <AlertCircle className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Recommended architecture</p>
                  <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-sm font-medium text-foreground">{output.engineerOutput.architecturePattern.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{output.engineerOutput.architecturePattern.rationale}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Required services</p>
                  <div className="flex flex-wrap gap-1.5">
                    {output.engineerOutput.requiredServices.map((svc, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md text-xs bg-muted text-foreground">{svc}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Risks & mitigations</p>
                  <div className="space-y-2">
                    {output.engineerOutput.risks.map((r, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-background/50">
                        <p className="text-xs font-medium text-foreground mb-1">{r.risk}</p>
                        <p className="text-xs text-muted-foreground">{r.mitigation}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Validation checklist (PoC gates)</p>
                  <div className="space-y-1">
                    {output.engineerOutput.validationChecklist.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <div className="w-3 h-3 rounded-sm border border-muted-foreground/40 flex-shrink-0" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Context Request — also in output for easy access */}
            <ContextRequestCard
              customerName={customerName}
              meetingContext={briefScope === 'specific-area' ? specificArea : undefined}
              colleagueNotes={colleagueNotes}
              onColleagueNotes={setColleagueNotes}
              hasNewContext={colleagueNotes.trim().length > 0}
            />

            {/* Recommended Packages */}
            <RecommendedPackages
              maturityGaps={getMaturityGapsFromOutput(output)}
              briefId={customerName.trim()}
              onPackageAdded={(pkgId, tier) => {
                toast.success('Package added to deal plan');
              }}
            />

            {/* AI Opportunity Map (Partner View) */}
            {output.aiOpportunities.length > 0 && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">AI Opportunity Areas (partner view)</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Based on current signals only.</p>
                
                <div className="space-y-3">
                  {output.aiOpportunities.map((opp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-background/80 border border-border/50"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-medium text-foreground">{opp.name}</p>
                        {getEffortBadge(opp.effortVsImpact)}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1.5">{opp.whyRelevant}</p>
                      <p className="text-xs text-primary">{opp.partnerAction}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conditional Refinements */}
            {output.conditionalRefinements.length > 0 && (
              <div className="rounded-xl border border-amber-200/50 bg-amber-50/30 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <h3 className="text-sm font-semibold text-foreground">If we had more signal, we'd refine like this</h3>
                </div>
                <div className="space-y-3">
                  {output.conditionalRefinements.map((ref, idx) => (
                    <div key={idx} className="text-sm">
                      <p className="text-foreground font-medium">{ref.condition}:</p>
                      <p className="text-muted-foreground ml-3">{ref.refinement}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Recommendations */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <h3 className="text-sm font-semibold text-foreground">Top Recommendations</h3>
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
              <div className="rounded-xl border border-border bg-muted/10 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <h3 className="text-sm font-semibold text-foreground">Who to Contact</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {output.routing.contacts.map((contact, idx) => (
                    <span key={idx} className="px-2 py-1 bg-muted/50 rounded-md text-xs text-foreground">
                      {contact}
                    </span>
                  ))}
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Next Steps</p>
                  <ul className="space-y-1">
                    {output.routing.steps.map((step, idx) => (
                      <li key={idx} className="text-xs text-foreground">{step}</li>
                    ))}
                  </ul>
                </div>
              </div>

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
                  onClick={() => handleCopySection(output.nextSevenDays.join('\n'))}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
              <ul className="space-y-2">
                {output.nextSevenDays.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="w-5 h-5 rounded-full bg-muted text-muted-foreground text-xs font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Reset Button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handleReset}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Start new brief
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
