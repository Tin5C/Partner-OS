// Account Intelligence — right-side panel for Deal Planning
// Supports file drop, paste text, add link, classify items, ask teammate

import { useState, useRef, useCallback } from 'react';
import {
  Lightbulb,
  Upload,
  FileText,
  Link2,
  Trash2,
  ClipboardPaste,
  Zap,
  File,
  Presentation,
  Newspaper,
  Mic,
  HelpCircle,
  X,
  Users,
  Send,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  addMemoryItem,
  listMemoryItems,
  updateMemoryType,
  deleteMemoryItem,
  MEMORY_TYPE_OPTIONS,
  type MemoryItemType,
} from '@/data/partner/accountMemoryStore';
import {
  createContentRequest,
  listContentRequests,
  type RequestType,
} from '@/data/partner/contentRequestStore';

const ACCEPTED_TYPES = '.pdf,.docx,.pptx,.mp4,.txt,.png,.jpg,.jpeg';

const TYPE_ICONS: Record<MemoryItemType, React.ReactNode> = {
  recording: <Mic className="w-3.5 h-3.5" />,
  transcript: <FileText className="w-3.5 h-3.5" />,
  rfp: <File className="w-3.5 h-3.5" />,
  architecture: <File className="w-3.5 h-3.5" />,
  slides: <Presentation className="w-3.5 h-3.5" />,
  news: <Newspaper className="w-3.5 h-3.5" />,
  other: <HelpCircle className="w-3.5 h-3.5" />,
};

const REQUEST_TYPE_OPTIONS: { value: RequestType; label: string }[] = [
  { value: 'recording', label: 'Recording' },
  { value: 'transcript_notes', label: 'Transcript / Notes' },
  { value: 'rfp_requirements', label: 'RFP / Requirements' },
  { value: 'architecture_diagram', label: 'Architecture / Diagram' },
  { value: 'slides_deck', label: 'Slides / Deck' },
  { value: 'news_article', label: 'News / Article' },
  { value: 'link', label: 'Link' },
  { value: 'other', label: 'Other' },
];

interface AccountInboxProps {
  accountId: string;
  onSignalPicker: () => void;
}

export function AccountInbox({ accountId, onSignalPicker }: AccountInboxProps) {
  const [, forceUpdate] = useState(0);
  const refresh = useCallback(() => forceUpdate((n) => n + 1), []);

  const items = listMemoryItems(accountId);
  const requests = listContentRequests(accountId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Paste text modal
  const [showPaste, setShowPaste] = useState(false);
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteContent, setPasteContent] = useState('');

  // Add link modal
  const [showLink, setShowLink] = useState(false);
  const [linkTitle, setLinkTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  // Ask teammate modal
  const [showAskTeammate, setShowAskTeammate] = useState(false);
  const [teammateName, setTeammateName] = useState('');
  const [requestType, setRequestType] = useState<RequestType>('other');
  const [questionText, setQuestionText] = useState('');

  // Classification pending
  const [classifyId, setClassifyId] = useState<string | null>(null);

  // Drag state
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const item = addMemoryItem({
        account_id: accountId,
        type: 'transcript',
        title: f.name,
        file_name: f.name,
        file_url: `local://${f.name}`,
      });
      setClassifyId(item.id);
      toast.success(`Added: ${f.name}`);
    }
    refresh();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handlePasteSubmit = () => {
    if (!pasteContent.trim()) return;
    const item = addMemoryItem({
      account_id: accountId,
      type: 'transcript',
      title: pasteTitle.trim() || 'Pasted notes',
      content: pasteContent,
    });
    setShowPaste(false);
    setPasteTitle('');
    setPasteContent('');
    setClassifyId(item.id);
    refresh();
    toast.success('Notes added');
  };

  const handleLinkSubmit = () => {
    if (!linkUrl.trim()) return;
    const item = addMemoryItem({
      account_id: accountId,
      type: 'news',
      title: linkTitle.trim() || linkUrl,
      content: linkUrl,
    });
    setShowLink(false);
    setLinkTitle('');
    setLinkUrl('');
    setClassifyId(item.id);
    refresh();
    toast.success('Link added');
  };

  const handleAskTeammateSubmit = () => {
    if (!teammateName.trim() || !questionText.trim()) return;
    createContentRequest({
      account_id: accountId,
      requested_from: teammateName.trim(),
      request_type: requestType,
      question_text: questionText.trim(),
    });
    setShowAskTeammate(false);
    setTeammateName('');
    setRequestType('other');
    setQuestionText('');
    refresh();
    toast.success('Request sent');
  };

  const handleClassify = (id: string, type: MemoryItemType) => {
    updateMemoryType(id, type);
    setClassifyId(null);
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteMemoryItem(id);
    refresh();
    toast.success('Removed');
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');

  return (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-primary" />
          Account Intelligence
        </h4>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          Store customer materials here.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'rounded-lg border border-dashed p-3 text-center cursor-pointer transition-all',
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-border/50 hover:border-primary/30 hover:bg-muted/10'
        )}
      >
        <Upload className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
        <p className="text-[10px] text-muted-foreground">
          Drop files or <span className="text-primary">browse</span>
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setShowPaste(true)}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
        >
          <ClipboardPaste className="w-3 h-3" />
          Paste
        </button>
        <button
          onClick={() => setShowLink(true)}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
        >
          <Link2 className="w-3 h-3" />
          Link
        </button>
        <button
          onClick={onSignalPicker}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
        >
          <Zap className="w-3 h-3" />
          Signals
        </button>
      </div>

      {/* Ask Teammate button */}
      <button
        onClick={() => setShowAskTeammate(true)}
        className="w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[11px] font-medium border border-dashed border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/[0.02] transition-all"
      >
        <Users className="w-3.5 h-3.5" />
        Ask teammate
      </button>

      {/* Paste text modal */}
      {showPaste && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowPaste(false)}>
          <div className="bg-card border border-border rounded-xl p-4 w-80 space-y-3 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Paste Text</p>
              <button onClick={() => setShowPaste(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <Input value={pasteTitle} onChange={(e) => setPasteTitle(e.target.value)} placeholder="Title (optional)" className="h-8 text-xs" />
            <Textarea value={pasteContent} onChange={(e) => setPasteContent(e.target.value)} placeholder="Paste meeting notes, transcript, or context…" className="text-xs min-h-[80px]" autoFocus />
            <div className="flex gap-2">
              <button onClick={handlePasteSubmit} disabled={!pasteContent.trim()} className={cn('flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors', pasteContent.trim() ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground cursor-not-allowed')}>Add</button>
              <button onClick={() => { setShowPaste(false); setPasteTitle(''); setPasteContent(''); }} className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add link modal */}
      {showLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowLink(false)}>
          <div className="bg-card border border-border rounded-xl p-4 w-80 space-y-3 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Add Link</p>
              <button onClick={() => setShowLink(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <Input value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} placeholder="Title (optional)" className="h-8 text-xs" />
            <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://…" className="h-8 text-xs" autoFocus />
            <div className="flex gap-2">
              <button onClick={handleLinkSubmit} disabled={!linkUrl.trim()} className={cn('flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors', linkUrl.trim() ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground cursor-not-allowed')}>Add</button>
              <button onClick={() => { setShowLink(false); setLinkTitle(''); setLinkUrl(''); }} className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Ask teammate modal */}
      {showAskTeammate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAskTeammate(false)}>
          <div className="bg-card border border-border rounded-xl p-4 w-80 space-y-3 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" /> Ask Teammate</p>
              <button onClick={() => setShowAskTeammate(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <Input value={teammateName} onChange={(e) => setTeammateName(e.target.value)} placeholder="Colleague name or email" className="h-8 text-xs" autoFocus />
            <div className="relative">
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value as RequestType)}
                className="w-full appearance-none text-xs font-medium text-foreground bg-background border border-input rounded-md px-2.5 py-1.5 pr-7 cursor-pointer"
              >
                {REQUEST_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <Textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="What do you need from them?" className="text-xs min-h-[60px]" />
            <div className="flex gap-2">
              <button
                onClick={handleAskTeammateSubmit}
                disabled={!teammateName.trim() || !questionText.trim()}
                className={cn('flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1', teammateName.trim() && questionText.trim() ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-muted text-muted-foreground cursor-not-allowed')}
              >
                <Send className="w-3 h-3" /> Send request
              </button>
              <button onClick={() => setShowAskTeammate(false)} className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Classification prompt */}
      {classifyId && (
        <div className="rounded-lg border border-primary/20 bg-primary/[0.03] p-2.5 space-y-2">
          <p className="text-[10px] font-medium text-foreground">What is this?</p>
          <div className="flex flex-wrap gap-1">
            {MEMORY_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleClassify(classifyId, opt.value)}
                className="px-2 py-0.5 rounded-full text-[9px] font-medium border border-border/60 bg-background hover:border-primary/30 hover:bg-primary/5 transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Pending teammate requests */}
      {pendingRequests.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            Pending Requests ({pendingRequests.length})
          </p>
          {pendingRequests.map((req) => (
            <div key={req.request_id} className="flex items-center gap-2 p-1.5 rounded-md bg-primary/[0.03] border border-primary/10">
              <Clock className="w-3 h-3 text-primary/60 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-foreground truncate">{req.requested_from}</p>
                <p className="text-[9px] text-muted-foreground truncate">{req.question_text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Items list */}
      {items.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            Items ({items.length})
          </p>
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted/20 group">
              <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                {TYPE_ICONS[item.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-foreground truncate">{item.title}</p>
                <span className="text-[9px] text-muted-foreground capitalize">
                  {MEMORY_TYPE_OPTIONS.find((o) => o.value === item.type)?.label ?? item.type}
                </span>
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-0.5 rounded text-muted-foreground/30 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
