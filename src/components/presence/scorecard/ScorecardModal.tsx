import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Save, Calendar, Users, Eye, Sparkles, Linkedin, Globe, FileText, Mic, Upload, Link2, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScorecardInputStrip } from './ScorecardInputStrip';
import { ScorecardIdentity } from './ScorecardIdentity';
import { ScorecardFindability } from './ScorecardFindability';
import { ScorecardEvidence } from './ScorecardEvidence';
import { ScorecardDimensions } from './ScorecardDimensions';
import { ScorecardOverall } from './ScorecardOverall';
import { ScorecardImprovements } from './ScorecardImprovements';
import { ScorecardConfidence } from './ScorecardConfidence';
import { usePresenceSources } from '@/hooks/usePresenceSources';
import { cn } from '@/lib/utils';
import {
  ScorecardInput,
  ScorecardResult,
  TierLevel,
  IdentityStatus,
  MOCK_PERSONA_1,
  MOCK_PERSONA_2,
  MOCK_PERSONA_TIER_0,
  MOCK_PERSONA_TIER_3,
  PersonSource,
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

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  linkedin: <Linkedin className="w-4 h-4" />,
  website: <Globe className="w-4 h-4" />,
  newsletter: <FileText className="w-4 h-4" />,
  podcast: <Mic className="w-4 h-4" />,
  speaker: <Users className="w-4 h-4" />,
  pdf: <Upload className="w-4 h-4" />,
};

export function ScorecardModal({ open, onOpenChange }: ScorecardModalProps) {
  const [input, setInput] = useState<ScorecardInput>(DEFAULT_INPUT);
  const [result, setResult] = useState<ScorecardResult | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<MockPersona>('persona1');
  const [identityPreview, setIdentityPreview] = useState<IdentityStatus>('confirmed');
  const [tierPreview, setTierPreview] = useState<TierLevel | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [editingSource, setEditingSource] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const { sources, connectedCount, connectSource, disconnectSource, getConfidenceFromSources } = usePresenceSources();

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const mockData = selectedPersona === 'persona1' ? MOCK_PERSONA_1 : MOCK_PERSONA_2;
      
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

  const getDisplayedOverall = () => {
    if (!result) return null;
    
    if (tierPreview !== null) {
      if (tierPreview === 0) {
        return { ...result.overall, ...MOCK_PERSONA_TIER_0.overall };
      }
      if (tierPreview === 3) {
        return { ...result.overall, ...MOCK_PERSONA_TIER_3.overall };
      }
      return { ...result.overall, tier: tierPreview };
    }
    
    return result.overall;
  };

  const displayedOverall = getDisplayedOverall();

  // Source handling
  const handleConnectSource = (sourceId: string) => {
    setEditingSource(sourceId);
    const source = sources.find(s => s.id === sourceId);
    setInputValue(source?.value || '');
  };

  const handleSaveSource = (sourceId: string) => {
    connectSource(sourceId, inputValue);
    setEditingSource(null);
    setInputValue('');
  };

  const handleRemoveSource = (sourceId: string) => {
    disconnectSource(sourceId);
  };

  // Get mock score for summary
  const mockScore = result?.overall.score || 62;
  const mockTier = result?.overall.tier || 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold">Buyer Perception Snapshot</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                How buyers are likely to perceive you.
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
            {/* Insight Summary Block (Always visible at top) */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                  "bg-muted/50"
                )}>
                  <Eye className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-foreground">Buyer Perception Snapshot</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                      Tier {mockTier}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    How buyers are likely to perceive you.
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <Progress value={mockScore} className="h-2 flex-1 max-w-[200px]" />
                    <span className="text-sm font-semibold text-foreground">{mockScore}/100</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Improve Signal Quality Section (Embedded) */}
            <div className="p-4 rounded-xl border border-border bg-muted/20">
              <div className="flex items-start gap-3 mb-4">
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                  "bg-muted/50"
                )}>
                  <Sparkles className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-medium text-foreground">Improve Signal Quality</h4>
                    {connectedCount > 0 && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                        {connectedCount} connected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Add sources to improve accuracy.
                  </p>
                </div>
              </div>

              {/* Source Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sources.map((source) => (
                  <div 
                    key={source.id}
                    className={cn(
                      "p-3 rounded-lg border transition-colors",
                      source.connected 
                        ? "border-primary/30 bg-primary/5" 
                        : "border-border bg-card"
                    )}
                  >
                    {editingSource === source.id ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{SOURCE_ICONS[source.type]}</span>
                          <span className="text-sm font-medium">{source.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {source.type === 'pdf' ? (
                            <div className="flex-1 flex items-center justify-center py-2 border border-dashed border-border rounded-lg text-xs text-muted-foreground cursor-pointer hover:bg-muted/30 transition-colors">
                              <Upload className="w-3.5 h-3.5 mr-1.5" />
                              Click to upload
                            </div>
                          ) : (
                            <Input
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              placeholder={`Enter ${source.label.toLowerCase()} URL`}
                              className="h-8 text-xs flex-1"
                            />
                          )}
                          <Button
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleSaveSource(source.id)}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => setEditingSource(null)}
                          >
                            <X className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "transition-colors",
                            source.connected ? "text-primary" : "text-muted-foreground"
                          )}>
                            {SOURCE_ICONS[source.type]}
                          </span>
                          <div>
                            <span className="text-sm font-medium">{source.label}</span>
                            {source.connected && source.value && (
                              <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                                {source.value}
                              </p>
                            )}
                          </div>
                        </div>
                        {source.connected ? (
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 text-[10px] px-2"
                              onClick={() => handleConnectSource(source.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 text-[10px] px-2 text-destructive hover:text-destructive"
                              onClick={() => handleRemoveSource(source.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 text-[10px] px-2"
                            onClick={() => handleConnectSource(source.id)}
                          >
                            <Link2 className="w-3 h-3 mr-1" />
                            Connect
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Scan Input Strip */}
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
              <div className="py-12 text-center space-y-4">
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
