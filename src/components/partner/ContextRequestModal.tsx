// Context Request Modal (Partner-only)
// "Send a context request" — email chips, optional tags, pre-filled message, copy templates

import { useState, useCallback, KeyboardEvent } from 'react';
import {
  X,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Mail,
  FileText,
  Upload,
  MessageSquare,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  REQUEST_TYPES,
  generateRequestTemplates,
  GeneratedTemplates,
} from '@/data/partnerRequestInfo';

interface ContextRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName: string;
  meetingContext?: string;
  colleagueNotes: string;
  onColleagueNotes: (notes: string) => void;
}

// Email chips input
function EmailChipsInput({
  emails,
  onEmailsChange,
}: {
  emails: string[];
  onEmailsChange: (emails: string[]) => void;
}) {
  const [input, setInput] = useState('');

  const addEmail = useCallback(
    (raw: string) => {
      const email = raw.trim().toLowerCase();
      if (email && email.includes('@') && !emails.includes(email)) {
        onEmailsChange([...emails, email]);
      }
      setInput('');
    },
    [emails, onEmailsChange]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
      e.preventDefault();
      addEmail(input);
    }
    if (e.key === 'Backspace' && !input && emails.length > 0) {
      onEmailsChange(emails.slice(0, -1));
    }
  };

  const handleBlur = () => {
    if (input.trim()) addEmail(input);
  };

  const removeEmail = (email: string) => {
    onEmailsChange(emails.filter((e) => e !== email));
  };

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1.5 min-h-[40px] w-full rounded-lg border border-border bg-background px-3 py-2',
        'focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30'
      )}
    >
      {emails.map((email) => (
        <span
          key={email}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium"
        >
          {email}
          <button
            type="button"
            onClick={() => removeEmail(email)}
            className="hover:text-destructive transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={emails.length === 0 ? 'colleague@company.com' : ''}
        className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
      />
    </div>
  );
}

// Template block with copy
function TemplateBlock({
  label,
  icon,
  content,
}: {
  label: string;
  icon: React.ReactNode;
  content: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success(`${label} template copied`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-border bg-muted/20 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs font-medium text-foreground">{label}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all',
            copied
              ? 'bg-primary/10 text-primary'
              : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
          )}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed max-h-[100px] overflow-y-auto">
        {content}
      </pre>
    </div>
  );
}

export function ContextRequestModal({
  open,
  onOpenChange,
  customerName,
  meetingContext,
  colleagueNotes,
  onColleagueNotes,
}: ContextRequestModalProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const [templates, setTemplates] = useState<GeneratedTemplates | null>(null);
  const [tracking, setTracking] = useState<{
    requestedAt: Date | null;
    received: boolean;
  }>({ requestedAt: null, received: false });

  // Pre-filled editable message
  const tagLabels = selectedTags
    .map((id) => REQUEST_TYPES.find((r) => r.id === id)?.label)
    .filter(Boolean);
  const defaultMessage = `Hey — I'm preparing a brief for ${customerName || '[Customer]'}${meetingContext ? ` for ${meetingContext}` : ''}.\n\nIf you have context on ${tagLabels.length > 0 ? tagLabels.join(', ') : 'the account'}, could you drop quick notes or screenshots? Redacted is fine.\n\nTakes ~2 minutes. Thanks!`;
  const [message, setMessage] = useState('');

  // Update message when tags/context change (only if user hasn't manually edited)
  const activeMessage = message || defaultMessage;

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
    // Reset message to re-generate default
    setMessage('');
    setTemplates(null);
  };

  const handleGenerateTemplates = () => {
    const result = generateRequestTemplates(
      customerName || 'the customer',
      selectedTags.length > 0 ? selectedTags : REQUEST_TYPES.map((r) => r.id),
      '',
      meetingContext
    );
    setTemplates(result);
    setTracking((prev) => ({ ...prev, requestedAt: new Date() }));
  };

  const handleToggleReceived = () => {
    setTracking((prev) => ({ ...prev, received: !prev.received }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">Send a context request</DialogTitle>
          <DialogDescription className="text-xs">
            Ask colleagues to share what they know about {customerName || 'this account'}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* 1. Recipients */}
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">
              Recipients
            </label>
            <EmailChipsInput emails={emails} onEmailsChange={setEmails} />
            <p className="text-[11px] text-muted-foreground mt-1">
              Press Enter or comma to add. Recipients will see the message below.
            </p>
          </div>

          {/* 2. Optional tags */}
          <div>
            <button
              type="button"
              onClick={() => setTagsExpanded(!tagsExpanded)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {tagsExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
              What do you need? (optional)
            </button>
            {tagsExpanded && (
              <div className="flex flex-wrap gap-2 mt-2">
                {REQUEST_TYPES.map((rt) => (
                  <button
                    key={rt.id}
                    type="button"
                    onClick={() => toggleTag(rt.id)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-medium transition-all border',
                      selectedTags.includes(rt.id)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card text-foreground border-border hover:bg-secondary'
                    )}
                  >
                    {rt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Message */}
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">
              Message
            </label>
            <Textarea
              value={activeMessage}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px] text-sm resize-none"
            />
          </div>

          {/* Generate templates */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGenerateTemplates}
              className={cn(
                'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              <Copy className="w-3.5 h-3.5" />
              Generate copy-ready templates
            </button>
          </div>

          {/* Templates output */}
          {templates && (
            <div className="space-y-2 pt-2 border-t border-border/50">
              <p className="text-xs font-medium text-muted-foreground">
                Copy and send via your preferred channel:
              </p>
              <TemplateBlock
                label="Slack / Teams"
                icon={<MessageCircle className="w-3.5 h-3.5 text-muted-foreground" />}
                content={templates.slack}
              />
              <TemplateBlock
                label="Email"
                icon={<Mail className="w-3.5 h-3.5 text-muted-foreground" />}
                content={templates.email}
              />
              <TemplateBlock
                label="Short version"
                icon={<FileText className="w-3.5 h-3.5 text-muted-foreground" />}
                content={templates.short}
              />
            </div>
          )}

          {/* Tracking */}
          {tracking.requestedAt && (
            <div className="flex items-center gap-4 pt-2 border-t border-border/50">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                Requested{' '}
                {tracking.requestedAt.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <button
                type="button"
                onClick={handleToggleReceived}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                  tracking.received
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {tracking.received ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <div className="w-3 h-3 rounded-sm border border-muted-foreground/50" />
                )}
                Received
              </button>
            </div>
          )}

          {/* Paste replies section */}
          <div className="pt-3 border-t border-border/50 space-y-2">
            <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3 text-muted-foreground" />
              Paste colleague responses / notes
            </label>
            <Textarea
              value={colleagueNotes}
              onChange={(e) => onColleagueNotes(e.target.value)}
              placeholder="Paste what your colleagues shared — apps, licenses, architecture notes, constraints..."
              className="min-h-[72px] text-sm resize-none"
            />
            <div className="border border-dashed border-border rounded-lg p-2 flex items-center gap-2">
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Upload screenshots/docs from colleagues
              </span>
              <button
                type="button"
                className="ml-auto text-xs text-primary hover:text-primary/80 font-medium"
              >
                Browse
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Redacted is fine. Pasted info will be used as evidence in the brief.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
