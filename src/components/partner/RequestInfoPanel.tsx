// Request Info from Colleagues Panel
// Lightweight feature for Partner Customer Brief

import { useState } from 'react';
import {
  Users,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Upload,
  MessageSquare,
  Mail,
  MessageCircle,
  FileText,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  REQUEST_TYPES,
  RequestTracking,
  generateRequestTemplates,
  GeneratedTemplates,
} from '@/data/partnerRequestInfo';

interface RequestInfoPanelProps {
  customerName: string;
  meetingContext?: string;
  onColleagueNotes: (notes: string) => void;
  colleagueNotes: string;
}

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
    <div className="rounded-lg border border-border bg-background/50 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-xs font-medium text-foreground">{label}</span>
        </div>
        <button
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
      <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed max-h-[120px] overflow-y-auto">
        {content}
      </pre>
    </div>
  );
}

export function RequestInfoPanel({
  customerName,
  meetingContext,
  onColleagueNotes,
  colleagueNotes,
}: RequestInfoPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [customQuestion, setCustomQuestion] = useState('');
  const [templates, setTemplates] = useState<GeneratedTemplates | null>(null);
  const [tracking, setTracking] = useState<RequestTracking>({
    requestedAt: null,
    received: false,
  });

  const toggleType = (id: string) => {
    setSelectedTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
    // Clear templates when selection changes
    setTemplates(null);
  };

  const handleGenerate = () => {
    if (selectedTypes.length === 0) {
      toast.error('Select at least one info type');
      return;
    }
    const result = generateRequestTemplates(
      customerName,
      selectedTypes,
      customQuestion,
      meetingContext
    );
    setTemplates(result);
    setTracking(prev => ({ ...prev, requestedAt: new Date() }));
  };

  const handleToggleReceived = () => {
    setTracking(prev => ({ ...prev, received: !prev.received }));
  };

  return (
    <div className="rounded-xl border border-border bg-muted/10 p-4">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Need more info from colleagues?
          </h3>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {!expanded && (
        <p className="text-xs text-muted-foreground mt-1 ml-6">
          Helpful when customer knowledge is spread across the team.
        </p>
      )}

      {expanded && (
        <div className="mt-4 space-y-4">
          {/* Request type chips */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">
              What info do you need?
            </p>
            <div className="flex flex-wrap gap-2">
              {REQUEST_TYPES.map(rt => (
                <button
                  key={rt.id}
                  type="button"
                  onClick={() => toggleType(rt.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                    selectedTypes.includes(rt.id)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-foreground border-border hover:bg-secondary'
                  )}
                >
                  {rt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom question */}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">
              Anything specific you want to ask?
            </label>
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => {
                setCustomQuestion(e.target.value);
                setTemplates(null);
              }}
              placeholder="e.g., Who's the technical decision-maker?"
              className={cn(
                'w-full h-9 px-3 rounded-lg text-sm',
                'bg-background border border-border',
                'placeholder:text-muted-foreground/60',
                'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30'
              )}
            />
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={selectedTypes.length === 0}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              'bg-primary text-primary-foreground',
              'hover:bg-primary/90',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <MessageSquare className="w-4 h-4" />
            Generate request
          </button>

          {/* Generated Templates */}
          {templates && (
            <div className="space-y-3 pt-3 border-t border-border/50">
              <p className="text-xs font-medium text-muted-foreground">
                Copy a template and send it to your team:
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
            <div className="flex items-center gap-4 pt-3 border-t border-border/50">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                Requested {tracking.requestedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <button
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
            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3" />
              Paste colleague responses / notes
            </label>
            <Textarea
              value={colleagueNotes}
              onChange={(e) => onColleagueNotes(e.target.value)}
              placeholder="Paste what your colleagues shared — apps, licenses, architecture notes, constraints, stakeholder info..."
              className="min-h-[80px] text-sm resize-none"
            />
            <div className="flex items-center gap-2">
              <div className="border border-dashed border-border rounded-lg p-2 flex items-center gap-2 flex-1">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  Upload screenshots/docs from colleagues
                </span>
                <button className="ml-auto text-xs text-primary hover:text-primary/80 font-medium">
                  Browse
                </button>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Upload only what you're allowed to share. Redacted is fine.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
