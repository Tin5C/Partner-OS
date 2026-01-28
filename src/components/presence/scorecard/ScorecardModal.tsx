import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Save, Calendar, Users } from 'lucide-react';
import { ScorecardInputStrip } from './ScorecardInputStrip';
import { ScorecardIdentity } from './ScorecardIdentity';
import { ScorecardFindability } from './ScorecardFindability';
import { ScorecardEvidence } from './ScorecardEvidence';
import { ScorecardDimensions } from './ScorecardDimensions';
import { ScorecardOverall } from './ScorecardOverall';
import { ScorecardImprovements } from './ScorecardImprovements';
import {
  ScorecardInput,
  ScorecardResult,
  TierLevel,
  IdentityStatus,
  MOCK_PERSONA_1,
  MOCK_PERSONA_2,
  MOCK_PERSONA_TIER_0,
  MOCK_PERSONA_TIER_3,
} from '@/lib/presenceScorecardData';

interface ScorecardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type MockPersona = 'persona1' | 'persona2';

const DEFAULT_INPUT: ScorecardInput = {
  name: '',
  employer: '',
  title: '',
  region: '',
  industry: '',
  productFocus: '',
};

export function ScorecardModal({ open, onOpenChange }: ScorecardModalProps) {
  const [input, setInput] = useState<ScorecardInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<ScorecardResult | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<MockPersona>('persona1');
  const [identityPreview, setIdentityPreview] = useState<IdentityStatus>('confirmed');
  const [tierPreview, setTierPreview] = useState<TierLevel | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleRunScan = () => {
    setIsScanning(true);
    // Simulate scan delay
    setTimeout(() => {
      const mockData = selectedPersona === 'persona1' ? MOCK_PERSONA_1 : MOCK_PERSONA_2;
      setResult(mockData);
      setInput(mockData.input);
      setIdentityPreview(mockData.identity.status);
      setTierPreview(null);
      setIsScanning(false);
    }, 800);
  };

  const handleReset = () => {
    setInput(DEFAULT_INPUT);
    setResult(null);
    setIdentityPreview('confirmed');
    setTierPreview(null);
  };

  const handlePersonaChange = (persona: MockPersona) => {
    setSelectedPersona(persona);
    const mockData = persona === 'persona1' ? MOCK_PERSONA_1 : MOCK_PERSONA_2;
    setResult(mockData);
    setInput(mockData.input);
    setIdentityPreview(mockData.identity.status);
    setTierPreview(null);
  };

  // Apply tier preview overrides
  const getDisplayedOverall = () => {
    if (!result) return null;
    
    if (tierPreview !== null) {
      // Get tier-specific mock data
      if (tierPreview === 0) {
        return { ...result.overall, ...MOCK_PERSONA_TIER_0.overall };
      }
      if (tierPreview === 3) {
        return { ...result.overall, ...MOCK_PERSONA_TIER_3.overall };
      }
      // For tier 1 and 2, just update the tier number
      return { ...result.overall, tier: tierPreview };
    }
    
    return result.overall;
  };

  const displayedOverall = getDisplayedOverall();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold">Personal Brand Scorecard</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Baseline your presence: clarity, credibility, consistency, and findability.
              </p>
            </div>

            {/* Mock Persona Switcher */}
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              <Select value={selectedPersona} onValueChange={(v) => handlePersonaChange(v as MockPersona)}>
                <SelectTrigger className="w-[180px] h-8 text-xs">
                  <SelectValue placeholder="Select persona" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="persona1">Sarah Chen (Tier 1)</SelectItem>
                  <SelectItem value="persona2">Marcus Weber (Tier 2)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Input Strip */}
            <div className="p-4 rounded-xl border border-border bg-muted/30">
              <ScorecardInputStrip
                input={input}
                onChange={setInput}
                onRunScan={handleRunScan}
                onReset={handleReset}
                isScanning={isScanning}
              />
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-4">
                {/* Section A: Identity */}
                <ScorecardIdentity
                  status={identityPreview}
                  dataNeeded={identityPreview === 'ambiguous' ? 'LinkedIn URL or unique identifier' : undefined}
                  onTogglePreview={setIdentityPreview}
                />

                {/* Only show full results if identity is confirmed */}
                {identityPreview === 'confirmed' && (
                  <>
                    {/* Section B: Findability */}
                    <ScorecardFindability
                      queries={result.findability.queries}
                      verdict={result.findability.verdict}
                      linkedInPercent={result.findability.linkedInPercent}
                      externalPercent={result.findability.externalPercent}
                    />

                    {/* Section C: Evidence Log */}
                    <ScorecardEvidence evidence={result.evidence} />

                    {/* Section D: Dimension Scores */}
                    <ScorecardDimensions dimensions={result.dimensions} />

                    {/* Section E: Overall Score + Tier */}
                    {displayedOverall && (
                      <ScorecardOverall
                        score={displayedOverall.score}
                        tier={displayedOverall.tier}
                        tierExplanation={displayedOverall.tierExplanation}
                        gatingChecks={displayedOverall.gatingChecks}
                        onPreviewTier={setTierPreview}
                      />
                    )}

                    {/* Section F: Improvements */}
                    <ScorecardImprovements improvements={result.improvements} />
                  </>
                )}
              </div>
            )}

            {/* Empty State */}
            {!result && (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Click "Run scan" to generate mock results, or select a persona above.
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs" disabled>
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Schedule weekly refresh
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-xs" disabled>
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download PDF
            </Button>
            <Button size="sm" className="h-8 text-xs" disabled>
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Save to Presence
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
