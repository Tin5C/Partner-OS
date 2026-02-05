// Seller Snapshot Form
// Inputs for seller persona capability assessment

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Link2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  SellerProfile,
  SELLER_INDUSTRIES,
  SELLER_SOLUTIONS,
} from '@/data/partnerCapabilityData';

interface SellerSnapshotFormProps {
  profile: Partial<SellerProfile>;
  onChange: (profile: Partial<SellerProfile>) => void;
}

export function SellerSnapshotForm({ profile, onChange }: SellerSnapshotFormProps) {
  const [linkedinInput, setLinkedinInput] = useState('');

  const toggleIndustry = (industry: string) => {
    const current = profile.industries || [];
    const updated = current.includes(industry)
      ? current.filter(i => i !== industry)
      : [...current, industry];
    onChange({ ...profile, industries: updated });
  };

  const toggleSolution = (solution: string) => {
    const current = profile.solutions || [];
    const updated = current.includes(solution)
      ? current.filter(s => s !== solution)
      : [...current, solution];
    onChange({ ...profile, solutions: updated });
  };

  const handleLinkedinAdd = () => {
    if (linkedinInput.trim()) {
      onChange({ ...profile, linkedinEvidence: linkedinInput.trim() });
      setLinkedinInput('');
    }
  };

  return (
    <div className="space-y-5">
      {/* Industries */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Industries you sell into
        </label>
        <div className="flex flex-wrap gap-2">
          {SELLER_INDUSTRIES.map((industry) => (
            <button
              key={industry}
              onClick={() => toggleIndustry(industry)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                "border",
                profile.industries?.includes(industry)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary/50"
              )}
            >
              {profile.industries?.includes(industry) && (
                <Check className="w-3 h-3 inline mr-1" />
              )}
              {industry}
            </button>
          ))}
        </div>
      </div>

      {/* Solutions */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Solutions you sell
        </label>
        <div className="flex flex-wrap gap-2">
          {SELLER_SOLUTIONS.map((solution) => (
            <button
              key={solution}
              onClick={() => toggleSolution(solution)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                "border",
                profile.solutions?.includes(solution)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary/50"
              )}
            >
              {profile.solutions?.includes(solution) && (
                <Check className="w-3 h-3 inline mr-1" />
              )}
              {solution}
            </button>
          ))}
        </div>
      </div>

      {/* Differentiation angle */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Your differentiation angle
        </label>
        <Textarea
          value={profile.differentiationAngle || ''}
          onChange={(e) => onChange({ ...profile, differentiationAngle: e.target.value })}
          placeholder="What makes you different? e.g., 'Rapid implementation with first value in 4 weeks'"
          className="text-sm min-h-[60px]"
        />
        <p className="text-[10px] text-muted-foreground mt-1">
          Keep it short — this becomes your positioning foundation.
        </p>
      </div>

      {/* Evidence upload */}
      <div className="p-4 rounded-xl border border-border bg-muted/20">
        <h4 className="text-sm font-medium text-foreground mb-3">
          Credibility signals
        </h4>
        
        <div className="space-y-3">
          {/* LinkedIn */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">
              LinkedIn profile or screenshot
            </label>
            <div className="flex items-center gap-2">
              <Input
                value={linkedinInput}
                onChange={(e) => setLinkedinInput(e.target.value)}
                placeholder="linkedin.com/in/yourprofile"
                className="text-sm h-9 flex-1"
              />
              <Button 
                size="sm" 
                variant="outline" 
                className="h-9 gap-1.5"
                onClick={handleLinkedinAdd}
              >
                <Link2 className="w-3.5 h-3.5" />
                Add
              </Button>
            </div>
            {profile.linkedinEvidence && (
              <p className="text-[10px] text-primary mt-1">
                ✓ LinkedIn connected
              </p>
            )}
          </div>

          {/* Customer quotes */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">
              Customer quotes or references (paste or upload)
            </label>
            <div className="flex items-center gap-2">
              <Textarea
                placeholder="Paste customer quotes, testimonials, or reference notes..."
                className="text-sm min-h-[60px] flex-1"
                onChange={(e) => {
                  const quotes = e.target.value.split('\n').filter(q => q.trim());
                  onChange({ ...profile, customerQuotes: quotes });
                }}
              />
            </div>
          </div>

          {/* Deck upload */}
          <div>
            <label className="text-xs text-muted-foreground block mb-1.5">
              Pitch decks (redacted OK)
            </label>
            <button className={cn(
              "flex items-center justify-center w-full py-3 rounded-lg",
              "border border-dashed border-border",
              "text-xs text-muted-foreground",
              "hover:border-primary/50 hover:bg-muted/30 transition-colors"
            )}>
              <Upload className="w-4 h-4 mr-2" />
              Upload deck
            </button>
            {profile.decksUploaded && profile.decksUploaded > 0 && (
              <p className="text-[10px] text-primary mt-1">
                ✓ {profile.decksUploaded} deck(s) uploaded
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
