// Partner Brief Input Form
// Quick form for partners to enter deal context

import { useState } from 'react';
import { X, ChevronDown, Check, Upload, Link2, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  PartnerBriefInput,
  DEAL_MOTIONS,
  INDUSTRIES,
  REGIONS,
  DEAL_SIZE_BANDS,
  TIMELINES,
  COMPETITORS,
  NEEDS_MOST,
} from '@/data/partnerBriefData';

interface PartnerBriefFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PartnerBriefInput) => void;
}

function ChipButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
        'border',
        selected
          ? 'bg-primary text-primary-foreground border-primary'
          : 'bg-card text-foreground border-border hover:bg-secondary'
      )}
    >
      {label}
    </button>
  );
}

export function PartnerBriefForm({
  open,
  onOpenChange,
  onSubmit,
}: PartnerBriefFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [dealMotion, setDealMotion] = useState('');
  const [industry, setIndustry] = useState('');
  const [region, setRegion] = useState('');
  const [dealSizeBand, setDealSizeBand] = useState('');
  const [timeline, setTimeline] = useState('');
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [customCompetitor, setCustomCompetitor] = useState('');
  const [needsMost, setNeedsMost] = useState<string[]>([]);
  const [pastedLink, setPastedLink] = useState('');

  const toggleCompetitor = (value: string) => {
    setCompetitors(prev =>
      prev.includes(value)
        ? prev.filter(c => c !== value)
        : [...prev, value]
    );
  };

  const addCustomCompetitor = () => {
    if (customCompetitor.trim() && !competitors.includes(customCompetitor.trim())) {
      setCompetitors(prev => [...prev, customCompetitor.trim()]);
      setCustomCompetitor('');
    }
  };

  const toggleNeed = (value: string) => {
    setNeedsMost(prev =>
      prev.includes(value)
        ? prev.filter(n => n !== value)
        : [...prev, value]
    );
  };

  const isValid = customerName.trim() && dealMotion;

  const handleSubmit = () => {
    if (!isValid) return;

    const data: PartnerBriefInput = {
      customerName: customerName.trim(),
      dealMotion,
      industry: industry || undefined,
      region: region || undefined,
      dealSizeBand: dealSizeBand || undefined,
      timeline: timeline || undefined,
      competitors: competitors.length > 0 ? competitors : undefined,
      needsMost,
      evidence: pastedLink ? { uploads: [], links: [{ id: '1', url: pastedLink, type: 'website' }], extractedSignals: { applications: [], architecture: [], licenses: [] } } : undefined,
    };

    onSubmit(data);
  };

  const handleReset = () => {
    setCustomerName('');
    setDealMotion('');
    setIndustry('');
    setRegion('');
    setDealSizeBand('');
    setTimeline('');
    setCompetitors([]);
    setCustomCompetitor('');
    setNeedsMost([]);
    setPastedLink('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
          <DialogTitle className="text-xl font-semibold">
            Partner Brief
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your deal context — get the right programs, funding, assets, and steps.
          </p>
        </DialogHeader>

        <div className="px-6 py-6 space-y-6">
          {/* Required Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Customer / Account Name <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Enter customer name..."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Deal Type / Motion <span className="text-destructive">*</span>
              </Label>
              <Select value={dealMotion} onValueChange={setDealMotion}>
                <SelectTrigger>
                  <SelectValue placeholder="Select deal motion..." />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_MOTIONS.map((motion) => (
                    <SelectItem key={motion.value} value={motion.value}>
                      {motion.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="space-y-4 pt-4 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Helpful (Optional)
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm">Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((ind) => (
                      <SelectItem key={ind.value} value={ind.value}>
                        {ind.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Region</Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((reg) => (
                      <SelectItem key={reg.value} value={reg.value}>
                        {reg.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Deal Size</Label>
                <Select value={dealSizeBand} onValueChange={setDealSizeBand}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {DEAL_SIZE_BANDS.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Timeline</Label>
                <Select value={timeline} onValueChange={setTimeline}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMELINES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Competitors */}
            <div className="space-y-2">
              <Label className="text-sm">Primary Competitor(s)</Label>
              <div className="flex flex-wrap gap-2">
                {COMPETITORS.map((comp) => (
                  <ChipButton
                    key={comp.value}
                    label={comp.label}
                    selected={competitors.includes(comp.value)}
                    onClick={() => toggleCompetitor(comp.value)}
                  />
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Add other..."
                  value={customCompetitor}
                  onChange={(e) => setCustomCompetitor(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomCompetitor()}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCustomCompetitor}
                  disabled={!customCompetitor.trim()}
                >
                  Add
                </Button>
              </div>
              {competitors.filter(c => !COMPETITORS.some(comp => comp.value === c)).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {competitors.filter(c => !COMPETITORS.some(comp => comp.value === c)).map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                    >
                      {c}
                      <button
                        type="button"
                        onClick={() => setCompetitors(prev => prev.filter(x => x !== c))}
                        className="hover:text-primary/70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* What do you need most? */}
            <div className="space-y-2">
              <Label className="text-sm">What do you need most?</Label>
              <div className="flex flex-wrap gap-2">
                {NEEDS_MOST.map((need) => (
                  <ChipButton
                    key={need.value}
                    label={need.label}
                    selected={needsMost.includes(need.value)}
                    onClick={() => toggleNeed(need.value)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="space-y-4 pt-4 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Attachments (Optional)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Upload area */}
              <div className="border border-dashed border-border rounded-xl p-4 text-center">
                <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
                <p className="text-xs text-muted-foreground">
                  Upload screenshots / docs
                </p>
                <Button variant="ghost" size="sm" className="mt-2">
                  <FileText className="w-4 h-4 mr-1" />
                  Browse
                </Button>
              </div>

              {/* Paste link */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Paste link</span>
                </div>
                <Input
                  placeholder="https://..."
                  value={pastedLink}
                  onChange={(e) => setPastedLink(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={handleReset}>
            Reset
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isValid}
              className="gap-2"
            >
              <Check className="w-4 h-4" />
              Generate Brief
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
