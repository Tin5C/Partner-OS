// Full profile editing panel (large drawer)
import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ChipSelect } from './ChipSelect';
import { SearchableMultiSelect } from './SearchableMultiSelect';
import {
  UserProfile,
  DEFAULT_PROFILE,
  ROLE_OPTIONS,
  REGION_OPTIONS,
  SEGMENT_OPTIONS,
  INDUSTRY_OPTIONS,
  DEFAULT_COMPETITORS,
  SKILLS_LIST,
  PLAY_OPTIONS,
  CONTENT_GOAL_OPTIONS,
  TONE_OPTIONS,
  CHANNEL_OPTIONS,
} from '@/lib/profileConfig';

interface ProfilePanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
}

export function ProfilePanel({
  open,
  onOpenChange,
  profile,
  onSave,
}: ProfilePanelProps) {
  const [formData, setFormData] = useState<UserProfile>(profile || DEFAULT_PROFILE);
  const [customCompetitors, setCustomCompetitors] = useState<string[]>([]);

  // Reset form when profile changes or panel opens
  useEffect(() => {
    if (open) {
      setFormData(profile || DEFAULT_PROFILE);
      // Extract any custom competitors not in default list
      const custom = (profile?.competitorsFaced || []).filter(
        (c) => !DEFAULT_COMPETITORS.includes(c as typeof DEFAULT_COMPETITORS[number])
      );
      setCustomCompetitors(custom);
    }
  }, [open, profile]);

  const updateField = <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  // Combined competitor options (default + custom)
  const allCompetitorOptions = [
    ...DEFAULT_COMPETITORS,
    ...customCompetitors.filter((c) => !DEFAULT_COMPETITORS.includes(c as typeof DEFAULT_COMPETITORS[number])),
  ];

  // Skills as chip options
  const skillOptions = SKILLS_LIST.map((s) => ({ id: s, label: s }));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[600px] p-0 flex flex-col"
      >
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-border bg-background">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold">Edit Profile</SheetTitle>
          </div>
        </SheetHeader>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="px-6 py-6 space-y-8">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Your name"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Role <span className="text-destructive">*</span>
              </Label>
              <ChipSelect
                options={ROLE_OPTIONS}
                selected={formData.role}
                onChange={(val) => updateField('role', val as UserProfile['role'])}
              />
            </div>

            {/* Region */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Region <span className="text-destructive">*</span>
              </Label>
              <ChipSelect
                options={REGION_OPTIONS}
                selected={formData.region}
                onChange={(val) => updateField('region', val as UserProfile['region'])}
              />
            </div>

            {/* Segment */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Segment <span className="text-destructive">*</span>
              </Label>
              <ChipSelect
                options={SEGMENT_OPTIONS}
                selected={formData.segments}
                onChange={(val) => updateField('segments', val as string[])}
                multiple
              />
            </div>

            <Separator />

            {/* Top Industries */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Top industries you sell into <span className="text-destructive">*</span>
                <span className="text-muted-foreground font-normal ml-1">(max 3)</span>
              </Label>
              <ChipSelect
                options={INDUSTRY_OPTIONS.map((i) => ({ id: i, label: i }))}
                selected={formData.topIndustries}
                onChange={(val) => updateField('topIndustries', val as string[])}
                multiple
                maxSelect={3}
              />
              <div className="mt-2">
                <Input
                  value={formData.otherIndustry || ''}
                  onChange={(e) => updateField('otherIndustry', e.target.value)}
                  placeholder="Other industry (optional)"
                  className="max-w-xs"
                />
              </div>
            </div>

            <Separator />

            {/* Competitors Faced */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Competitors you face most often <span className="text-destructive">*</span>
                <span className="text-muted-foreground font-normal ml-1">(max 8)</span>
              </Label>
              <SearchableMultiSelect
                options={allCompetitorOptions}
                selected={formData.competitorsFaced}
                onChange={(val) => {
                  updateField('competitorsFaced', val);
                  // Also add any custom ones to the list
                  const newCustom = val.filter(
                    (v) => !DEFAULT_COMPETITORS.includes(v as typeof DEFAULT_COMPETITORS[number])
                  );
                  setCustomCompetitors((prev) => [...new Set([...prev, ...newCustom])]);
                }}
                placeholder="Search competitors..."
                maxSelect={8}
                allowCustom
                customPlaceholder="Add competitor..."
              />
            </div>

            {/* Competitors to Track */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Competitors to track weekly <span className="text-destructive">*</span>
                <span className="text-muted-foreground font-normal ml-1">(max 5)</span>
              </Label>
              <p className="text-xs text-muted-foreground">
                Choose from competitors you face, or add new ones.
              </p>
              <SearchableMultiSelect
                options={[...new Set([...formData.competitorsFaced, ...allCompetitorOptions])]}
                selected={formData.competitorsToTrack}
                onChange={(val) => updateField('competitorsToTrack', val)}
                placeholder="Search or select..."
                maxSelect={5}
                allowCustom
              />
            </div>

            <Separator />

            {/* Skills */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Skills you want to improve <span className="text-destructive">*</span>
                <span className="text-muted-foreground font-normal ml-1">(max 5)</span>
              </Label>
              <p className="text-xs text-muted-foreground">
                Select skills to personalize your Skill of the Week.
              </p>
              <ChipSelect
                options={skillOptions}
                selected={formData.skillsToImprove}
                onChange={(val) => updateField('skillsToImprove', val as string[])}
                multiple
                maxSelect={5}
              />
            </div>

            <Separator />

            {/* Optional Section Header */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Optional
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                These help us personalize content further.
              </p>
            </div>

            {/* Preferred Plays */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Preferred plays</Label>
              <ChipSelect
                options={PLAY_OPTIONS}
                selected={formData.preferredPlays || []}
                onChange={(val) => updateField('preferredPlays', val as string[])}
                multiple
              />
            </div>

            {/* Content Goal */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Content goal</Label>
              <ChipSelect
                options={CONTENT_GOAL_OPTIONS}
                selected={formData.contentGoal || ''}
                onChange={(val) => updateField('contentGoal', val as UserProfile['contentGoal'])}
              />
            </div>

            {/* Tone */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Tone</Label>
              <ChipSelect
                options={TONE_OPTIONS}
                selected={formData.tone || 'enterprise-safe'}
                onChange={(val) => updateField('tone', val as UserProfile['tone'])}
              />
            </div>

            {/* Channels */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Channels</Label>
              <ChipSelect
                options={CHANNEL_OPTIONS}
                selected={formData.channels || []}
                onChange={(val) => updateField('channels', val as string[])}
                multiple
              />
            </div>

            {/* Known For */}
            <div className="space-y-2">
              <Label htmlFor="knownFor" className="text-sm font-medium">
                What do you want to be known for?
              </Label>
              <Textarea
                id="knownFor"
                value={formData.knownFor || ''}
                onChange={(e) => updateField('knownFor', e.target.value)}
                placeholder="1-2 sentences about your personal brand..."
                rows={2}
              />
            </div>

            {/* Contrarian Insight */}
            <div className="space-y-2">
              <Label htmlFor="contrarianInsight" className="text-sm font-medium">
                Contrarian insight
              </Label>
              <Textarea
                id="contrarianInsight"
                value={formData.contrarianInsight || ''}
                onChange={(e) => updateField('contrarianInsight', e.target.value)}
                placeholder="An unpopular opinion or unique perspective you hold..."
                rows={2}
              />
            </div>
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-background flex items-center justify-end gap-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Profile
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
