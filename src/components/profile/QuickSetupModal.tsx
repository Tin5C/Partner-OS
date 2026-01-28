// Quick setup onboarding modal (two-step flow)
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ChipSelect } from './ChipSelect';
import {
  UserProfile,
  DEFAULT_PROFILE,
  ROLE_OPTIONS,
  REGION_OPTIONS,
  SEGMENT_OPTIONS,
} from '@/lib/profileConfig';

// Reduced industry options for quick setup
const QUICK_INDUSTRY_OPTIONS = [
  { id: 'Financial Services', label: 'Financial Services' },
  { id: 'Healthcare', label: 'Healthcare' },
  { id: 'Manufacturing', label: 'Manufacturing' },
  { id: 'Retail & Consumer', label: 'Retail & Consumer' },
  { id: 'Technology', label: 'Technology' },
  { id: 'Energy & Utilities', label: 'Energy & Utilities' },
  { id: 'Government', label: 'Government' },
  { id: 'Education', label: 'Education' },
];

interface QuickSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile | null;
  userName?: string;
  onSave: (profile: UserProfile) => void;
  onSkip: () => void;
}

export function QuickSetupModal({
  open,
  onOpenChange,
  profile,
  userName,
  onSave,
  onSkip,
}: QuickSetupModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({
    ...DEFAULT_PROFILE,
    name: userName || '',
  });

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setStep(1);
      setFormData({
        ...(profile || DEFAULT_PROFILE),
        name: userName || profile?.name || '',
      });
    }
  }, [open, profile, userName]);

  const updateField = <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Check if step 1 is valid (role and region are required)
  const isStep1Valid = formData.role && formData.region;

  const handleContinue = () => {
    if (isStep1Valid) {
      setStep(2);
    }
  };

  const handleFinish = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const handleSkip = () => {
    // Save partial profile if any data exists
    if (formData.role || formData.region) {
      onSave(formData);
    }
    onSkip();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold">
            Quick setup <span className="text-muted-foreground font-normal">(30s)</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            This helps us personalize Stories, Briefings, and Account Prep for you.
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="px-6 pb-4">
          <div className="flex gap-2">
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
        <div className="px-6 pb-6 space-y-6">
          {step === 1 && (
            <>
              <div>
                <h3 className="text-sm font-medium text-foreground mb-4">
                  Your role & market
                </h3>
                
                {/* Role */}
                <div className="space-y-3 mb-5">
                  <Label className="text-sm text-muted-foreground">
                    Role <span className="text-destructive">*</span>
                  </Label>
                  <ChipSelect
                    options={ROLE_OPTIONS}
                    selected={formData.role}
                    onChange={(val) => updateField('role', val as UserProfile['role'])}
                  />
                </div>

                {/* Region */}
                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground">
                    Region <span className="text-destructive">*</span>
                  </Label>
                  <ChipSelect
                    options={REGION_OPTIONS}
                    selected={formData.region}
                    onChange={(val) => updateField('region', val as UserProfile['region'])}
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <h3 className="text-sm font-medium text-foreground mb-4">
                  What do you focus on?
                </h3>
                
                {/* Segment */}
                <div className="space-y-3 mb-5">
                  <Label className="text-sm text-muted-foreground">
                    Segment
                  </Label>
                  <ChipSelect
                    options={SEGMENT_OPTIONS}
                    selected={formData.segments[0] || ''}
                    onChange={(val) => updateField('segments', val ? [val as string] : [])}
                  />
                </div>

                {/* Industries */}
                <div className="space-y-3">
                  <Label className="text-sm text-muted-foreground">
                    Top industries you sell into{' '}
                    <span className="font-normal">(max 3)</span>
                  </Label>
                  <ChipSelect
                    options={QUICK_INDUSTRY_OPTIONS}
                    selected={formData.topIndustries}
                    onChange={(val) => updateField('topIndustries', val as string[])}
                    multiple
                    maxSelect={3}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip for now
          </Button>
          
          {step === 1 ? (
            <Button
              onClick={handleContinue}
              disabled={!isStep1Valid}
            >
              Continue
            </Button>
          ) : (
            <Button onClick={handleFinish}>
              Finish setup
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
