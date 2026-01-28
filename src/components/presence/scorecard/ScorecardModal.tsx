import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Save, Calendar, Users, Link2 } from 'lucide-react';
import { ScorecardInputStrip } from './ScorecardInputStrip';
import { ScorecardIdentity } from './ScorecardIdentity';
import { ScorecardFindability } from './ScorecardFindability';
import { ScorecardEvidence } from './ScorecardEvidence';
import { ScorecardDimensions } from './ScorecardDimensions';
import { ScorecardOverall } from './ScorecardOverall';
import { ScorecardImprovements } from './ScorecardImprovements';
import { ScorecardConfidence } from './ScorecardConfidence';
import { SourcesModal } from './SourcesModal';
import { usePresenceSources } from '@/hooks/usePresenceSources';
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
  const [showSourcesModal, setShowSourcesModal] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);

  const { sources, connectedCount, connectSource, disconnectSource, getConfidenceFromSources } = usePresenceSources();

  const handleRunScan = () => {
    setIsScanning(true);
    // Simulate scan delay
    setTimeout(() => {
      const mockData = selectedPersona === 'persona1' ? MOCK_PERSONA_1 : MOCK_PERSONA_2;
      
      // Adjust confidence based on connected sources
      const confidence = getConfidenceFromSources();
      const adjustedResult: ScorecardResult = {
        ...mockData,
        confidence: {
          level: connectedCount > 0 ? confidence.level : 'low',
          percent: connectedCount > 0 ? confidence.percent : 25,
          sourcesUsed: connectedCount,
          maxSources: 6,
        },
      };
      
      setResult(adjustedResult);
      setInput(mockData.input);
      setIdentityPreview(mockData.identity.status);
      setTierPreview(null);
      setIsScanning(false);
      setHasScanned(true);
    }, 800);
  };

  const handleReset = () => {
    setInput(DEFAULT_INPUT);
    setResult(null);
    setIdentityPreview('confirmed');
    setTierPreview(null);
    setHasScanned(false);
  };

  const handlePersonaChange = (persona: MockPersona) => {
    setSelectedPersona(persona);
    const mockData = persona === 'persona1' ? MOCK_PERSONA_1 : MOCK_PERSONA_2;
    
    // Adjust confidence based on connected sources
    const confidence = getConfidenceFromSources();
    const adjustedResult: ScorecardResult = {
      ...mockData,
      confidence: {
        level: connectedCount > 0 ? confidence.level : mockData.confidence.level,
        percent: connectedCount > 0 ? confidence.percent : mockData.confidence.percent,
        sourcesUsed: connectedCount,
        maxSources: 6,
      },
    };
    
    setResult(adjustedResult);
    setInput(mockData.input);
    setIdentityPreview(mockData.identity.status);
    setTierPreview(null);
    setHasScanned(true);
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

  const handleOpenSources = () => {
    setShowSourcesModal(true);
  };

  const handleRescanFromSources = () => {
    setShowSourcesModal(false);
    handleRunScan();
  };

  return (
    <>
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

              {/* Mock Persona Switcher + Sources */}
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs"
                  onClick={handleOpenSources}
                >
                  <Link2 className="w-3.5 h-3.5 mr-1.5" />
                  Sources ({connectedCount})
                </Button>
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
                <p className="text-[10px] text-muted-foreground mt-3 text-center">
                  MVP: results are mock data for UI preview. Enter any name to generate a baseline scan.
                </p>
              </div>

              {/* Results */}
              {result && (
                <div className="space-y-4">
                  {/* Confidence Indicator */}
                  <ScorecardConfidence
                    level={result.confidence.level}
                    percent={result.confidence.percent}
                    sourcesUsed={result.confidence.sourcesUsed}
                    maxSources={result.confidence.maxSources}
                    onAddSources={handleOpenSources}
                  />

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
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                    <Users className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Run your first scan
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                      Enter your name to generate a baseline presence scan. We'll simulate what buyers see when they search for you.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="text-xs" onClick={handleOpenSources}>
                      <Link2 className="w-3.5 h-3.5 mr-1.5" />
                      Add sources first
                    </Button>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      Adding sources improves scan accuracy
                    </p>
                  </div>
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

      {/* Sources Modal */}
      <SourcesModal
        open={showSourcesModal}
        onOpenChange={setShowSourcesModal}
        sources={sources}
        onConnect={connectSource}
        onDisconnect={disconnectSource}
        showRescanHint={hasScanned}
        onRescan={handleRescanFromSources}
      />
    </>
  );
}
