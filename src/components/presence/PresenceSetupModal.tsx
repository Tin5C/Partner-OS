import * as React from 'react';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChipSelect } from '@/components/profile/ChipSelect';
import { Linkedin, Upload, ChevronDown, Link2, Globe, FileText, Mail, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PresenceData, DEFAULT_PRESENCE, PRESENCE_GOALS, isValidLinkedInUrl } from '@/lib/presenceConfig';

interface PresenceSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presence: PresenceData | null;
  onSave: (presence: PresenceData) => void;
  onSkip: () => void;
}

export function PresenceSetupModal({
  open,
  onOpenChange,
  presence,
  onSave,
  onSkip,
}: PresenceSetupModalProps) {
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<PresenceData>(presence || { ...DEFAULT_PRESENCE });
  const [linkedinUrl, setLinkedinUrl] = useState(presence?.linkedinUrl || '');
  const [linkedinError, setLinkedinError] = useState('');
  const [pdfUploaded, setPdfUploaded] = useState(presence?.linkedinPdfUploaded || false);
  const [additionalSourcesOpen, setAdditionalSourcesOpen] = useState(false);
  
  // Additional sources
  const [blogUrl, setBlogUrl] = useState(presence?.blogUrl || '');
  const [mediumUrl, setMediumUrl] = useState(presence?.mediumUrl || '');
  const [githubUrl, setGithubUrl] = useState(presence?.githubUrl || '');
  const [newsletterUrl, setNewsletterUrl] = useState(presence?.newsletterUrl || '');
  
  // Goals
  const [goals, setGoals] = useState<string[]>(presence?.goals || []);

  // Reset state when modal opens
  React.useEffect(() => {
    if (open) {
      setStep(1);
      setDraft(presence || { ...DEFAULT_PRESENCE });
      setLinkedinUrl(presence?.linkedinUrl || '');
      setPdfUploaded(presence?.linkedinPdfUploaded || false);
      setBlogUrl(presence?.blogUrl || '');
      setMediumUrl(presence?.mediumUrl || '');
      setGithubUrl(presence?.githubUrl || '');
      setNewsletterUrl(presence?.newsletterUrl || '');
      setGoals(presence?.goals || []);
      setLinkedinError('');
      setAdditionalSourcesOpen(false);
    }
  }, [open, presence]);

  const handleLinkedinUrlChange = (value: string) => {
    setLinkedinUrl(value);
    setLinkedinError('');
    if (value && !isValidLinkedInUrl(value)) {
      setLinkedinError('Please enter a valid LinkedIn URL');
    }
  };

  const handlePdfUpload = () => {
    // In MVP, just mark as uploaded (actual upload would need storage)
    setPdfUploaded(true);
  };

  const handleContinue = () => {
    setStep(2);
  };

  const handleFinish = () => {
    const finalPresence: PresenceData = {
      linkedinUrl: linkedinUrl.trim() || undefined,
      linkedinPdfUploaded: pdfUploaded,
      blogUrl: blogUrl.trim() || undefined,
      mediumUrl: mediumUrl.trim() || undefined,
      githubUrl: githubUrl.trim() || undefined,
      newsletterUrl: newsletterUrl.trim() || undefined,
      goals,
      isConfigured: true,
    };
    onSave(finalPresence);
    onOpenChange(false);
  };

  const handleSkip = () => {
    onSkip();
    onOpenChange(false);
  };

  const hasLinkedinSource = linkedinUrl.trim() || pdfUploaded;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold">Set up Presence</h2>
            <span className="text-xs text-muted-foreground">Optional</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Track and improve your visibility signals over time.
          </p>
          {/* Progress dots */}
          <div className="flex gap-1.5 mt-4">
            <div className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              step >= 1 ? "bg-primary" : "bg-muted"
            )} />
            <div className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              step >= 2 ? "bg-primary" : "bg-muted"
            )} />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-medium mb-1">LinkedIn connection</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  We'll use this to tailor Presence insights and recommended content to share.
                  We won't post anything for you.
                </p>
              </div>

              {/* Option A: LinkedIn URL */}
              <div className="space-y-2">
                <Label htmlFor="linkedin-url" className="text-sm flex items-center gap-2">
                  <Linkedin className="w-4 h-4 text-muted-foreground" />
                  Paste LinkedIn URL
                </Label>
                <Input
                  id="linkedin-url"
                  placeholder="https://www.linkedin.com/in/..."
                  value={linkedinUrl}
                  onChange={(e) => handleLinkedinUrlChange(e.target.value)}
                  className={cn(linkedinError && "border-destructive")}
                />
                {linkedinError && (
                  <p className="text-xs text-destructive">{linkedinError}</p>
                )}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">or</span>
                </div>
              </div>

              {/* Option B: PDF Upload */}
              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Upload LinkedIn PDF export
                </Label>
                <button
                  onClick={handlePdfUpload}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-dashed transition-colors",
                    pdfUploaded 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {pdfUploaded ? (
                    <>
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">PDF uploaded</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Click to upload PDF</span>
                    </>
                  )}
                </button>
                <p className="text-xs text-muted-foreground">
                  Export your profile from LinkedIn Settings → Data privacy → Get a copy of your data
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              {/* Additional Sources - Collapsed */}
              <Collapsible open={additionalSourcesOpen} onOpenChange={setAdditionalSourcesOpen}>
                <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full">
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform",
                    additionalSourcesOpen && "rotate-180"
                  )} />
                  <span>Add more sources (optional)</span>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="blog" className="text-xs flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" />
                      Blog / Website
                    </Label>
                    <Input
                      id="blog"
                      placeholder="https://..."
                      value={blogUrl}
                      onChange={(e) => setBlogUrl(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medium" className="text-xs flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5" />
                      Medium
                    </Label>
                    <Input
                      id="medium"
                      placeholder="https://medium.com/@..."
                      value={mediumUrl}
                      onChange={(e) => setMediumUrl(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github" className="text-xs flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5" />
                      GitHub
                    </Label>
                    <Input
                      id="github"
                      placeholder="https://github.com/..."
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newsletter" className="text-xs flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      Newsletter
                    </Label>
                    <Input
                      id="newsletter"
                      placeholder="https://..."
                      value={newsletterUrl}
                      onChange={(e) => setNewsletterUrl(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Goals */}
              <div className="space-y-3">
                <div>
                  <Label className="text-sm">What do you want to improve?</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Select all that apply</p>
                </div>
                <ChipSelect
                  options={PRESENCE_GOALS.map(g => ({ id: g.id, label: g.label }))}
                  selected={goals}
                  onChange={(val) => setGoals(Array.isArray(val) ? val : [val])}
                  multiple
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30">
          <div className="flex justify-between items-center">
            <button
              onClick={handleSkip}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip for now
            </button>
            <div className="flex gap-2">
              {step === 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
              )}
              {step === 1 ? (
                <Button
                  size="sm"
                  onClick={handleContinue}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleFinish}
                >
                  Save Presence
                </Button>
              )}
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 text-center">
            You can change or remove this anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
