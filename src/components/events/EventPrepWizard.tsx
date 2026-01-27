import { useState } from 'react';
import { X, Sparkles, MessageCircle, HelpCircle, Mail, Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EventData, generateEventPrep, EventPrepContent } from '@/data/mockEvents';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const GOAL_OPTIONS = [
  { id: 'Network', label: 'Network', icon: '🤝' },
  { id: 'Learn', label: 'Learn', icon: '📚' },
  { id: 'Find leads', label: 'Find leads', icon: '🎯' },
  { id: 'Partner meeting', label: 'Partner meeting', icon: '🤝' },
] as const;

interface EventPrepWizardProps {
  event: EventData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventPrepWizard({ event, open, onOpenChange }: EventPrepWizardProps) {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [prepContent, setPrepContent] = useState<EventPrepContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!event || !selectedGoal) return;

    setIsGenerating(true);
    
    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const content = generateEventPrep(event, selectedGoal);
    setPrepContent(content);
    setIsGenerating(false);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    });
  };

  const handleClose = () => {
    setSelectedGoal(null);
    setPrepContent(null);
    setIsGenerating(false);
    onOpenChange(false);
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            60-Second Prep
          </DialogTitle>
        </DialogHeader>

        {/* Event context */}
        <div className="px-4 py-3 rounded-xl bg-secondary/50 mb-4">
          <p className="text-sm font-medium text-foreground">{event.title}</p>
          <p className="text-xs text-muted-foreground">{event.venue}, {event.city}</p>
        </div>

        {!prepContent ? (
          // Goal selection
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground mb-3">What's your goal for this event?</h4>
              <div className="grid grid-cols-2 gap-2">
                {GOAL_OPTIONS.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-xl text-left transition-all duration-200',
                      selectedGoal === goal.id
                        ? 'bg-primary text-primary-foreground shadow-soft'
                        : 'bg-card border border-border hover:border-primary/50'
                    )}
                  >
                    <span className="text-lg">{goal.icon}</span>
                    <span className="font-medium text-sm">{goal.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!selectedGoal || isGenerating}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium',
                'bg-primary text-primary-foreground shadow-soft',
                'hover:bg-primary/90 active:scale-[0.98] transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Prep</span>
                </>
              )}
            </button>
          </div>
        ) : (
          // Prep content display
          <div className="space-y-6">
            {/* Goal badge */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                Goal: {selectedGoal}
              </span>
            </div>

            {/* Conversation starters */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-foreground">Conversation Starters</h4>
              </div>
              <div className="space-y-2">
                {prepContent.conversationStarters.map((starter, idx) => (
                  <div
                    key={idx}
                    className="group flex items-start gap-2 p-3 rounded-xl bg-card border border-border"
                  >
                    <p className="flex-1 text-sm text-muted-foreground">{starter}</p>
                    <button
                      onClick={() => handleCopy(starter, 'Conversation starter')}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-secondary transition-all"
                    >
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Questions to ask */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4 text-primary" />
                <h4 className="font-semibold text-foreground">Questions to Ask</h4>
              </div>
              <div className="space-y-2">
                {prepContent.questionsToAsk.map((question, idx) => (
                  <div
                    key={idx}
                    className="group flex items-start gap-2 p-3 rounded-xl bg-card border border-border"
                  >
                    <p className="flex-1 text-sm text-muted-foreground">{question}</p>
                    <button
                      onClick={() => handleCopy(question, 'Question')}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-secondary transition-all"
                    >
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Follow-up draft */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <h4 className="font-semibold text-foreground">Follow-up Message Draft</h4>
                </div>
                <button
                  onClick={() => handleCopy(prepContent.followUpDraft, 'Follow-up message')}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-muted-foreground hover:bg-secondary transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </button>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border">
                <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">
                  {prepContent.followUpDraft}
                </pre>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <button
                onClick={() => {
                  setSelectedGoal(null);
                  setPrepContent(null);
                }}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium',
                  'bg-card text-secondary-foreground border border-border',
                  'hover:bg-secondary active:scale-[0.98] transition-all duration-200'
                )}
              >
                Generate Another
              </button>
              <button
                onClick={handleClose}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium',
                  'bg-primary text-primary-foreground shadow-soft',
                  'hover:bg-primary/90 active:scale-[0.98] transition-all duration-200'
                )}
              >
                <Check className="w-4 h-4" />
                Done
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
