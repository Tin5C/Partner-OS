// Partner Capability & Brand Snapshot Modal
// Persona-aware (Seller vs Engineer) capability assessment

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Briefcase, 
  Code2, 
  ChevronRight, 
  Upload, 
  Link2, 
  Sparkles,
  Target,
  Shield,
  FileText,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SellerSnapshotForm } from './SellerSnapshotForm';
import { EngineerSnapshotForm } from './EngineerSnapshotForm';
import { SellerSnapshotOutput } from './SellerSnapshotOutput';
import { EngineerSnapshotOutput } from './EngineerSnapshotOutput';
import {
  PartnerPersona,
  SellerProfile,
  EngineerProfile,
  SellerOutput,
  EngineerOutput,
  SignalScore,
  calculateSellerScore,
  calculateEngineerScore,
  generateSellerOutputs,
  generateEngineerOutputs,
  getRecommendedDeepDives,
} from '@/data/partnerCapabilityData';

interface CapabilitySnapshotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPersona?: PartnerPersona;
}

export function CapabilitySnapshotModal({
  open,
  onOpenChange,
  initialPersona = 'seller',
}: CapabilitySnapshotModalProps) {
  const [persona, setPersona] = useState<PartnerPersona>(initialPersona);
  const [sellerProfile, setSellerProfile] = useState<Partial<SellerProfile>>({});
  const [engineerProfile, setEngineerProfile] = useState<Partial<EngineerProfile>>({});
  const [sellerOutput, setSellerOutput] = useState<SellerOutput | null>(null);
  const [engineerOutput, setEngineerOutput] = useState<EngineerOutput | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Calculate scores
  const sellerScore = calculateSellerScore(sellerProfile);
  const engineerScore = calculateEngineerScore(engineerProfile);
  const currentScore = persona === 'seller' ? sellerScore : engineerScore;

  // Get recommended deep dives
  const recommendedDeepDives = getRecommendedDeepDives(persona, currentScore);

  const handleGenerate = () => {
    if (persona === 'seller') {
      const output = generateSellerOutputs(sellerProfile as SellerProfile);
      setSellerOutput(output);
    } else {
      const output = generateEngineerOutputs(engineerProfile as EngineerProfile);
      setEngineerOutput(output);
    }
    setHasGenerated(true);
  };

  const handleReset = () => {
    if (persona === 'seller') {
      setSellerProfile({});
      setSellerOutput(null);
    } else {
      setEngineerProfile({});
      setEngineerOutput(null);
    }
    setHasGenerated(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              Capability & Brand Snapshot
            </DialogTitle>

            {/* Persona Switcher */}
            <Tabs value={persona} onValueChange={(v) => setPersona(v as PartnerPersona)}>
              <TabsList className="h-8">
                <TabsTrigger value="seller" className="text-xs gap-1.5 px-3">
                  <Briefcase className="w-3.5 h-3.5" />
                  Seller
                </TabsTrigger>
                <TabsTrigger value="engineer" className="text-xs gap-1.5 px-3">
                  <Code2 className="w-3.5 h-3.5" />
                  Engineer
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Signal Strength Meter */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
                  currentScore.level === 'High' 
                    ? "bg-emerald-500/10" 
                    : currentScore.level === 'Medium' 
                    ? "bg-[#EEF0FF]" 
                    : "bg-muted/50"
                )}>
                  <TrendingUp className={cn(
                    "w-5 h-5",
                    currentScore.level === 'High' 
                      ? "text-emerald-600" 
                      : currentScore.level === 'Medium' 
                      ? "text-[#6D6AF6]" 
                      : "text-muted-foreground"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-foreground">Signal Strength</h3>
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded font-medium",
                      currentScore.level === 'High' 
                        ? "bg-emerald-500/10 text-emerald-700" 
                        : currentScore.level === 'Medium' 
                        ? "bg-[#EEF0FF] text-[#4F46E5]" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {currentScore.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Progress 
                      value={currentScore.score} 
                      className={cn(
                        "h-2 flex-1 max-w-[200px]",
                        currentScore.level === 'High' && "[&>div]:bg-emerald-500",
                        currentScore.level === 'Medium' && "[&>div]:bg-[#6D6AF6]"
                      )} 
                    />
                    <span className="text-sm font-semibold text-foreground">
                      {currentScore.score}/100
                    </span>
                  </div>
                  
                  {/* Top 3 actions to improve */}
                  {currentScore.topThreeActions.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                        To reach 80+
                      </p>
                      {currentScore.topThreeActions.map((action, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center gap-2 text-xs text-foreground"
                        >
                          <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                            {idx + 1}
                          </div>
                          {action}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Persona-specific content */}
            {persona === 'seller' ? (
              <>
                {/* Seller perception preview */}
                <div className="p-4 rounded-xl border border-border bg-muted/20">
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-muted-foreground" />
                    How buyers likely perceive you
                  </h4>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {sellerProfile.industries && sellerProfile.industries.length > 0 ? (
                      <li>• Focused on {sellerProfile.industries.slice(0, 2).join(', ')}</li>
                    ) : (
                      <li className="text-muted-foreground/60">• Industry focus not defined</li>
                    )}
                    {sellerProfile.solutions && sellerProfile.solutions.length > 0 ? (
                      <li>• Sells {sellerProfile.solutions.slice(0, 2).join(', ')}</li>
                    ) : (
                      <li className="text-muted-foreground/60">• Solution focus not defined</li>
                    )}
                    {sellerProfile.differentiationAngle ? (
                      <li>• Known for: {sellerProfile.differentiationAngle}</li>
                    ) : (
                      <li className="text-muted-foreground/60">• Differentiation not articulated</li>
                    )}
                  </ul>
                </div>

                {/* Seller form */}
                <SellerSnapshotForm
                  profile={sellerProfile}
                  onChange={setSellerProfile}
                />

                {/* Generate button */}
                <div className="flex items-center gap-3">
                  <Button onClick={handleGenerate} className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Generate Positioning
                  </Button>
                  {hasGenerated && (
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                      Reset
                    </Button>
                  )}
                </div>

                {/* Seller output */}
                {sellerOutput && (
                  <SellerSnapshotOutput output={sellerOutput} />
                )}
              </>
            ) : (
              <>
                {/* Engineer perception preview */}
                <div className="p-4 rounded-xl border border-border bg-muted/20">
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    How buyers perceive your technical credibility
                  </h4>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {engineerProfile.roles && engineerProfile.roles.length > 0 ? (
                      <li>• {engineerProfile.roles[0]}</li>
                    ) : (
                      <li className="text-muted-foreground/60">• Role not defined</li>
                    )}
                    {engineerProfile.solutionAreas && engineerProfile.solutionAreas.length > 0 ? (
                      <li>• Expert in {engineerProfile.solutionAreas.slice(0, 2).join(', ')}</li>
                    ) : (
                      <li className="text-muted-foreground/60">• Solution areas not defined</li>
                    )}
                    {engineerProfile.deliveryProof && engineerProfile.deliveryProof.length > 0 ? (
                      <li>• {engineerProfile.deliveryProof.length} delivery artifact(s) uploaded</li>
                    ) : (
                      <li className="text-muted-foreground/60">• No delivery proof uploaded</li>
                    )}
                    {engineerProfile.certifications && engineerProfile.certifications.length > 0 ? (
                      <li>• Certified: {engineerProfile.certifications.slice(0, 2).join(', ')}</li>
                    ) : (
                      <li className="text-muted-foreground/60">• Certifications not listed</li>
                    )}
                  </ul>
                </div>

                {/* Engineer form */}
                <EngineerSnapshotForm
                  profile={engineerProfile}
                  onChange={setEngineerProfile}
                />

                {/* Generate button */}
                <div className="flex items-center gap-3">
                  <Button onClick={handleGenerate} className="gap-2">
                    <Sparkles className="w-4 h-4" />
                    Generate Capability Snapshot
                  </Button>
                  {hasGenerated && (
                    <Button variant="ghost" size="sm" onClick={handleReset}>
                      Reset
                    </Button>
                  )}
                </div>

                {/* Engineer output */}
                {engineerOutput && (
                  <EngineerSnapshotOutput output={engineerOutput} />
                )}
              </>
            )}

            {/* Recommended deep dives (connect to learning) */}
            {recommendedDeepDives.length > 0 && (
              <div className="p-4 rounded-xl border border-border bg-muted/10">
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-primary" />
                  {persona === 'seller' 
                    ? 'Recommended deep dives to strengthen positioning'
                    : 'Recommended deep dives to strengthen delivery confidence'
                  }
                </h4>
                <div className="space-y-2">
                  {recommendedDeepDives.map((dive, idx) => (
                    <button
                      key={idx}
                      className={cn(
                        "flex items-center justify-between w-full p-3 rounded-lg text-left",
                        "bg-card border border-border",
                        "hover:border-primary/30 hover:bg-primary/5",
                        "transition-colors"
                      )}
                    >
                      <span className="text-sm text-foreground">{dive}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Safety note */}
            <p className="text-[10px] text-muted-foreground text-center">
              Upload only what you're allowed to share. Redacted is fine.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
