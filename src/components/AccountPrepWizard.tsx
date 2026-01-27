import { useState, useEffect } from 'react';
import { X, ChevronDown, Check, Upload, FileText, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

// Sample accounts for demo
const SAMPLE_ACCOUNTS = [
  'Sulzer',
  'Siemens',
  'ABB',
  'Schneider Electric',
  'Honeywell',
  'Rockwell Automation',
  'Emerson',
  'GE Digital',
  'Bosch',
  'BASF',
];

const INTENT_OPTIONS = [
  'Prep for a meeting',
  'Pitch / propose something',
  'Handle objections',
  'Align internal team',
  'Write a follow-up email',
];

const GOAL_OPTIONS = [
  'Discovery',
  'Exec alignment',
  'Security review',
  'Pricing / procurement',
  'Next steps / close plan',
  'Renewal / expansion',
];

const OUTCOME_OPTIONS = [
  'Agree next step + date',
  'Get access to key stakeholder',
  'Confirm pain + impact',
  'Align on solution scope',
  'Unblock a risk (security/legal)',
  'Confirm buying process + timeline',
  'Move to PoC / workshop',
  'Send proposal',
  'Pricing alignment',
  'Renewal decision path',
];

const STORAGE_KEY = 'account_prep_last_selections';

interface AccountPrepWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (data: AccountPrepData) => void;
}

export interface AccountPrepData {
  account: string;
  intent: string;
  goal: string;
  outcome: string;
  context?: {
    worry?: string;
    pastedText?: string;
    screenshots?: string[];
  };
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
        'px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
        'border shadow-chip',
        selected
          ? 'bg-primary text-primary-foreground border-primary shadow-soft'
          : 'bg-card text-foreground border-border hover:bg-secondary hover:border-secondary-foreground/20'
      )}
    >
      {label}
    </button>
  );
}

export function AccountPrepWizard({
  open,
  onOpenChange,
  onGenerate,
}: AccountPrepWizardProps) {
  const [account, setAccount] = useState('');
  const [accountSearch, setAccountSearch] = useState('');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [intent, setIntent] = useState('');
  const [goal, setGoal] = useState('');
  const [outcome, setOutcome] = useState('');
  const [contextOpen, setContextOpen] = useState(false);
  const [worry, setWorry] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [contextTab, setContextTab] = useState('paste');

  // Load saved selections on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.account) setAccount(data.account);
        if (data.intent) setIntent(data.intent);
        if (data.goal) setGoal(data.goal);
        if (data.outcome) setOutcome(data.outcome);
      } catch (e) {
        // Invalid saved data, ignore
      }
    }
  }, [open]);

  // Save selections when they change
  useEffect(() => {
    if (account || intent || goal || outcome) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ account, intent, goal, outcome })
      );
    }
  }, [account, intent, goal, outcome]);

  const filteredAccounts = SAMPLE_ACCOUNTS.filter((a) =>
    a.toLowerCase().includes(accountSearch.toLowerCase())
  );

  const isValid = account && intent && goal && outcome;

  const handleGenerate = () => {
    if (!isValid) return;

    const data: AccountPrepData = {
      account,
      intent,
      goal,
      outcome,
      context: {
        worry: worry || undefined,
        pastedText: pastedText || undefined,
      },
    };

    onGenerate(data);
    onOpenChange(false);
  };

  const handleReset = () => {
    setAccount('');
    setAccountSearch('');
    setIntent('');
    setGoal('');
    setOutcome('');
    setWorry('');
    setPastedText('');
    setContextOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[900px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4">
          <DialogTitle className="text-xl font-semibold">
            Account Prep
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-6 space-y-8">
          {/* Step 1: Select Account */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                1
              </span>
              <h3 className="text-sm font-medium text-foreground">
                Select Account <span className="text-destructive">*</span>
              </h3>
            </div>
            <div className="relative">
              <Input
                placeholder="Search accounts..."
                value={account || accountSearch}
                onChange={(e) => {
                  setAccountSearch(e.target.value);
                  setAccount('');
                  setShowAccountDropdown(true);
                }}
                onFocus={() => setShowAccountDropdown(true)}
                className="pr-10"
              />
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              {showAccountDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {filteredAccounts.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">
                      No accounts found
                    </div>
                  ) : (
                    filteredAccounts.map((acc) => (
                      <button
                        key={acc}
                        type="button"
                        className={cn(
                          'w-full px-4 py-2.5 text-left text-sm hover:bg-secondary transition-colors',
                          account === acc && 'bg-primary/10 text-primary'
                        )}
                        onClick={() => {
                          setAccount(acc);
                          setAccountSearch('');
                          setShowAccountDropdown(false);
                        }}
                      >
                        {acc}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
            {account && (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {account}
                </span>
                <button
                  type="button"
                  onClick={() => setAccount('')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Intent */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                2
              </span>
              <h3 className="text-sm font-medium text-foreground">
                Intent <span className="text-destructive">*</span>
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {INTENT_OPTIONS.map((opt) => (
                <ChipButton
                  key={opt}
                  label={opt}
                  selected={intent === opt}
                  onClick={() => setIntent(opt)}
                />
              ))}
            </div>
          </div>

          {/* Step 3: Goal */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                3
              </span>
              <h3 className="text-sm font-medium text-foreground">
                Goal <span className="text-destructive">*</span>
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {GOAL_OPTIONS.map((opt) => (
                <ChipButton
                  key={opt}
                  label={opt}
                  selected={goal === opt}
                  onClick={() => setGoal(opt)}
                />
              ))}
            </div>
          </div>

          {/* Step 4: Desired Outcome */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                4
              </span>
              <h3 className="text-sm font-medium text-foreground">
                Desired Outcome <span className="text-destructive">*</span>
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {OUTCOME_OPTIONS.map((opt) => (
                <ChipButton
                  key={opt}
                  label={opt}
                  selected={outcome === opt}
                  onClick={() => setOutcome(opt)}
                />
              ))}
            </div>
          </div>

          {/* Optional Context */}
          <Collapsible open={contextOpen} onOpenChange={setContextOpen}>
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronDown
                  className={cn(
                    'w-4 h-4 transition-transform',
                    contextOpen && 'rotate-180'
                  )}
                />
                Add context (optional)
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Anything you're worried about?
                </label>
                <Input
                  placeholder="e.g., They might bring up a competitor..."
                  value={worry}
                  onChange={(e) => setWorry(e.target.value)}
                />
              </div>

              <Tabs value={contextTab} onValueChange={setContextTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="paste" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Paste text
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="gap-2">
                    <Image className="w-4 h-4" />
                    Upload screenshots
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="paste" className="mt-3">
                  <Textarea
                    placeholder="Paste agenda, notes, or any relevant context..."
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    className="min-h-[120px]"
                  />
                </TabsContent>
                <TabsContent value="upload" className="mt-3">
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drag & drop screenshots here
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      (1–3 images, PNG or JPG)
                    </p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Browse files
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CollapsibleContent>
          </Collapsible>
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
              onClick={handleGenerate}
              disabled={!isValid}
              className="gap-2"
            >
              <Check className="w-4 h-4" />
              Generate Prep
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
