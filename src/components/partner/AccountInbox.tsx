// Account Memory — compact tray rail for Deal Planning
// Single "Add evidence" CTA opens tabbed modal (Upload / Paste text / Add link)
// Shows top 3 items + "View all (N)" for full list drawer
// Canonical storage: accountMemoryStore

import { useState, useRef, useCallback } from 'react';
import {
  Database,
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
  ChevronRight,
  ArrowUpRight,
  BookOpen,
  Plus,
  CheckSquare,
  Square,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  addMemoryItem,
  listMemoryItems,
  deleteMemoryItem,
  MEMORY_TYPE_OPTIONS,
  type MemoryItemType,
} from '@/data/partner/accountMemoryStore';
import {
  createContentRequest,
  listContentRequests,
  type RequestType,
} from '@/data/partner/contentRequestStore';
import {
  addItem as addInboxItem,
  makeInboxItemId,
  deriveImpactArea,
} from '@/data/partner/dealPlanningInboxStore';

const ACCEPTED_TYPES = '.pdf,.docx,.pptx,.mp4,.txt,.png,.jpg,.jpeg';
const TRAY_PREVIEW_COUNT = 3;

const TYPE_ICONS: Record<MemoryItemType, React.ReactNode> = {
  recording: <Mic className="w-3.5 h-3.5" />,
  transcript_notes: <FileText className="w-3.5 h-3.5" />,
  rfp_requirements: <File className="w-3.5 h-3.5" />,
  architecture_diagram: <File className="w-3.5 h-3.5" />,
  slides_deck: <Presentation className="w-3.5 h-3.5" />,
  news_article: <Newspaper className="w-3.5 h-3.5" />,
  link: <Link2 className="w-3.5 h-3.5" />,
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

// ============= Deterministic classification suggester =============

function suggestClassification(text: string): { suggestedType: MemoryItemType; confidence: 'high' | 'medium' | 'low' } {
  const t = text.toLowerCase();
  const rules: { keywords: string[]; type: MemoryItemType }[] = [
    { keywords: ['rfp', 'requirements', 'tender'], type: 'rfp_requirements' },
    { keywords: ['architecture', 'diagram', 'design', 'integration'], type: 'architecture_diagram' },
    { keywords: ['security', 'compliance', 'dpa', 'iso', 'soc2'], type: 'other' },
    { keywords: ['pricing', 'offer', 'proposal', 'contract', 'msa', 'sow'], type: 'other' },
    { keywords: ['notes', 'meeting', 'call', 'summary', 'transcript'], type: 'transcript_notes' },
    { keywords: ['slides', 'deck', 'presentation', 'pptx', 'ppt'], type: 'slides_deck' },
    { keywords: ['recording', 'video', 'mp4', 'webinar'], type: 'recording' },
    { keywords: ['news', 'article', 'press', 'announcement'], type: 'news_article' },
  ];
  for (const rule of rules) {
    const matchCount = rule.keywords.filter((k) => t.includes(k)).length;
    if (matchCount >= 2) return { suggestedType: rule.type, confidence: 'high' };
    if (matchCount === 1) return { suggestedType: rule.type, confidence: 'medium' };
  }
  return { suggestedType: 'other', confidence: 'low' };
}

// ============= Add Evidence Modal Tab =============

type AddTab = 'upload' | 'paste' | 'link';

// ============= Intake pending state =============

interface IntakePending {
  mode: 'file' | 'paste' | 'link';
  title: string;
  suggestedType: MemoryItemType;
  confidence: 'high' | 'medium' | 'low';
  fileName?: string;
  fileUrl?: string;
  url?: string;
  contentText?: string;
}

// ============= Evidence Item Row (compact) =============

function EvidenceItemRow({
  item,
  expanded,
  onToggle,
  onDelete,
}: {
  item: { id: string; title: string; type: MemoryItemType; content_text?: string; created_at: string; tags?: string[] };
  expanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const summary = item.content_text
    ? item.content_text.split('\n').find((l) => l.trim())?.slice(0, 140) || ''
    : '';

  return (
    <div className="rounded-lg border border-border/40 overflow-hidden transition-colors hover:border-border/70">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-2 p-2 text-left cursor-pointer"
      >
        <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
          {TYPE_ICONS[item.type]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-medium text-foreground truncate">{item.title}</p>
          {summary && !expanded && (
            <p className="text-[10px] text-muted-foreground/80 truncate mt-0.5">{summary}…</p>
          )}
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[9px] text-muted-foreground">
              {MEMORY_TYPE_OPTIONS.find((o) => o.value === item.type)?.label ?? item.type}
            </span>
            <span className="text-[9px] text-muted-foreground/60">
              {new Date(item.created_at).toLocaleDateString()}
            </span>
            {item.tags?.map((tag) => (
              <span key={tag} className="text-[8px] px-1 py-px rounded bg-muted/40 text-muted-foreground">{tag}</span>
            ))}
          </div>
        </div>
        <ChevronRight className={cn(
          'w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0 transition-transform duration-200',
          expanded && 'rotate-90'
        )} />
      </button>

      <div className={cn(
        'grid transition-all duration-200 ease-in-out',
        expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      )}>
        <div className="overflow-hidden">
          <div className="px-2 pb-2 space-y-2">
            {item.content_text && (
              <div className="max-h-48 overflow-y-auto rounded-md bg-muted/20 p-2">
                <p className="text-[10px] text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {item.content_text}
                </p>
              </div>
            )}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-medium text-destructive/80 hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Remove from Deal
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toast.info('Promote to Driver — coming soon'); }}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-medium text-primary/80 hover:bg-primary/10 transition-colors"
              >
                <ArrowUpRight className="w-3 h-3" />
                Promote to Driver
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toast.info('Open in Account Intelligence — coming soon'); }}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-medium text-muted-foreground hover:bg-muted/30 transition-colors"
              >
                <BookOpen className="w-3 h-3" />
                Open in Intelligence
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= Main Component =============

interface AccountInboxProps {
  accountId: string;
  onSignalPicker: () => void;
}

export function AccountInbox({ accountId, onSignalPicker }: AccountInboxProps) {
  const [, forceUpdate] = useState(0);
  const refresh = useCallback(() => forceUpdate((n) => n + 1), []);

  const items = listMemoryItems(accountId);
  const requests = listContentRequests(accountId);
  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---- Modal / drawer visibility ----
  const [showAddModal, setShowAddModal] = useState(false);
  const [addTab, setAddTab] = useState<AddTab>('upload');
  const [showAllDrawer, setShowAllDrawer] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // ---- Intake confirmation ----
  const [intakePending, setIntakePending] = useState<IntakePending | null>(null);
  const [intakeTitle, setIntakeTitle] = useState('');
  const [intakeType, setIntakeType] = useState<MemoryItemType>('other');
  const [intakeAddToDealPlan, setIntakeAddToDealPlan] = useState(false);
  const [intakeTags, setIntakeTags] = useState('');

  // ---- Tab form state ----
  const [pasteContent, setPasteContent] = useState('');
  const [pasteTitle, setPasteTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [dragOver, setDragOver] = useState(false);

  // ---- Ask teammate ----
  const [showAskTeammate, setShowAskTeammate] = useState(false);
  const [teammateName, setTeammateName] = useState('');
  const [requestType, setRequestType] = useState<RequestType>('other');
  const [questionText, setQuestionText] = useState('');

  // ============= Intake helpers =============

  const openIntakeModal = (pending: IntakePending) => {
    setIntakePending(pending);
    setIntakeTitle(pending.title);
    setIntakeType(pending.suggestedType);
    setIntakeAddToDealPlan(false);
    setIntakeTags('');
    setShowAddModal(false); // close add modal, open confirm
  };

  const closeIntakeModal = () => {
    setIntakePending(null);
    setIntakeTitle('');
    setIntakeType('other');
    setIntakeAddToDealPlan(false);
    setIntakeTags('');
  };

  const handleIntakeSave = () => {
    if (!intakePending || !intakeTitle.trim()) return;
    const tags = intakeTags.split(',').map((t) => t.trim()).filter(Boolean);
    const memItem = addMemoryItem({
      account_id: accountId,
      type: intakeType,
      title: intakeTitle.trim(),
      content_text: intakePending.contentText,
      url: intakePending.url,
      file_url: intakePending.fileUrl,
      file_name: intakePending.fileName,
      tags: tags.length > 0 ? tags : undefined,
    });
    toast.success('Saved to Account Intelligence');
    if (intakeAddToDealPlan) {
      const inboxId = makeInboxItemId(accountId, 'initiative', memItem.id);
      addInboxItem(accountId, {
        id: inboxId,
        focusId: accountId,
        source_type: 'initiative',
        source_id: memItem.id,
        title: memItem.title,
        why_now: `Evidence: ${MEMORY_TYPE_OPTIONS.find((o) => o.value === intakeType)?.label ?? intakeType}`,
        impact_area: deriveImpactArea(intakeType),
        tags: tags,
        created_at: new Date().toISOString(),
      });
      toast.success('Added shortcut to Deal Plan');
    }
    closeIntakeModal();
    refresh();
  };

  // ---- File handling ----
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    const fileUrl = URL.createObjectURL(f);
    const classification = suggestClassification(f.name);
    openIntakeModal({
      mode: 'file',
      title: f.name,
      suggestedType: classification.suggestedType,
      confidence: classification.confidence,
      fileName: f.name,
      fileUrl,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handlePasteSubmit = () => {
    if (!pasteContent.trim()) return;
    const title = pasteTitle.trim() || pasteContent.slice(0, 60).trim() || 'New note';
    const classification = suggestClassification(title + ' ' + pasteContent);
    openIntakeModal({
      mode: 'paste',
      title,
      suggestedType: classification.suggestedType,
      confidence: classification.confidence,
      contentText: pasteContent,
    });
    setPasteTitle('');
    setPasteContent('');
  };

  const handleLinkSubmit = () => {
    if (!linkUrl.trim()) return;
    const title = linkTitle.trim() || linkUrl;
    const classification = suggestClassification(title + ' ' + linkUrl);
    openIntakeModal({
      mode: 'link',
      title,
      suggestedType: classification.suggestedType,
      confidence: classification.confidence,
      url: linkUrl,
    });
    setLinkTitle('');
    setLinkUrl('');
  };

  const handleDelete = (id: string) => {
    deleteMemoryItem(id);
    refresh();
    toast.success('Removed');
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

  const previewItems = items.slice(0, TRAY_PREVIEW_COUNT);
  const remainingCount = items.length - previewItems.length;

  // ============= RENDER =============
  return (
    <div className="space-y-2.5">
      {/* ===== Compact Tray Header ===== */}
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-primary" />
          Customer Evidence
          {items.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-muted/60 text-muted-foreground text-[10px] font-bold ml-1">
              {items.length}
            </span>
          )}
        </h4>
      </div>

      {/* ===== Primary CTA ===== */}
      <button
        onClick={() => { setAddTab('upload'); setShowAddModal(true); }}
        className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
      >
        <Plus className="w-3.5 h-3.5" />
        Add evidence
      </button>

      {/* ===== Secondary actions (compact) ===== */}
      <div className="flex gap-1.5">
        <button
          onClick={onSignalPicker}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors border border-border/40"
        >
          <Zap className="w-3 h-3" />
          Signals
        </button>
        <button
          onClick={() => setShowAskTeammate(true)}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors border border-border/40"
        >
          <Users className="w-3 h-3" />
          Ask teammate
        </button>
      </div>

      {/* ===== Pending Requests (compact) ===== */}
      {pendingRequests.length > 0 && (
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-primary/[0.03] border border-primary/10">
          <Clock className="w-3 h-3 text-primary/60 flex-shrink-0" />
          <p className="text-[10px] text-muted-foreground">
            <span className="font-medium text-foreground">{pendingRequests.length}</span> pending request{pendingRequests.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* ===== Top 3 Evidence Items ===== */}
      {previewItems.length > 0 && (
        <div className="space-y-1">
          {previewItems.map((item) => (
            <EvidenceItemRow
              key={item.id}
              item={item}
              expanded={expandedItemId === item.id}
              onToggle={() => setExpandedItemId(expandedItemId === item.id ? null : item.id)}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </div>
      )}

      {/* ===== View All ===== */}
      {remainingCount > 0 && (
        <button
          onClick={() => setShowAllDrawer(true)}
          className="w-full text-center py-1.5 rounded-md text-[10px] font-medium text-primary hover:bg-primary/5 transition-colors"
        >
          View all ({items.length})
        </button>
      )}

      {/* ===== Add Evidence Modal (3 tabs) ===== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAddModal(false)}>
          <div className="bg-card border border-border rounded-xl p-5 w-[360px] space-y-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Add Evidence</p>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>

            {/* Tab strip */}
            <div className="inline-flex rounded-lg bg-muted/50 p-0.5 border border-border/60 w-full">
              {([
                { key: 'upload' as const, label: 'Upload', icon: <Upload className="w-3 h-3" /> },
                { key: 'paste' as const, label: 'Paste text', icon: <ClipboardPaste className="w-3 h-3" /> },
                { key: 'link' as const, label: 'Add link', icon: <Link2 className="w-3 h-3" /> },
              ]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setAddTab(tab.key)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-medium transition-all',
                    addTab === tab.key
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Upload tab */}
            {addTab === 'upload' && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_TYPES}
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'rounded-lg border border-dashed p-6 text-center cursor-pointer transition-all',
                    dragOver
                      ? 'border-primary bg-primary/5'
                      : 'border-border/50 hover:border-primary/30 hover:bg-muted/10'
                  )}
                >
                  <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    Drop files or <span className="text-primary font-medium">browse</span>
                  </p>
                  <p className="text-[9px] text-muted-foreground/60 mt-1">PDF, DOCX, PPTX, MP4, TXT, PNG/JPG</p>
                </div>
              </div>
            )}

            {/* Paste text tab */}
            {addTab === 'paste' && (
              <div className="space-y-3">
                <Input value={pasteTitle} onChange={(e) => setPasteTitle(e.target.value)} placeholder="Title (optional)" className="h-8 text-xs" />
                <Textarea value={pasteContent} onChange={(e) => setPasteContent(e.target.value)} placeholder="Paste meeting notes, transcript, or context…" className="text-xs min-h-[100px]" autoFocus />
                <button
                  onClick={handlePasteSubmit}
                  disabled={!pasteContent.trim()}
                  className={cn(
                    'w-full py-2 rounded-lg text-xs font-medium transition-colors',
                    pasteContent.trim()
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  )}
                >
                  Next
                </button>
              </div>
            )}

            {/* Add link tab */}
            {addTab === 'link' && (
              <div className="space-y-3">
                <Input value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} placeholder="Title (optional)" className="h-8 text-xs" />
                <Input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://…" className="h-8 text-xs" autoFocus />
                <button
                  onClick={handleLinkSubmit}
                  disabled={!linkUrl.trim()}
                  className={cn(
                    'w-full py-2 rounded-lg text-xs font-medium transition-colors',
                    linkUrl.trim()
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  )}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== Intake Confirmation Modal ===== */}
      {intakePending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={closeIntakeModal}>
          <div className="bg-card border border-border rounded-xl p-5 w-[340px] space-y-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Confirm Evidence</p>
              <button onClick={closeIntakeModal} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>

            {intakePending.confidence === 'low' && (
              <p className="text-[10px] text-muted-foreground bg-muted/30 rounded-md px-2 py-1.5">
                We couldn't confidently classify this — please confirm the type below.
              </p>
            )}

            <div>
              <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Title</label>
              <Input value={intakeTitle} onChange={(e) => setIntakeTitle(e.target.value)} placeholder="Evidence title" className="h-8 text-xs" autoFocus />
            </div>

            <div>
              <label className="text-[10px] font-medium text-muted-foreground mb-1 block">
                What is this?
                {intakePending.confidence !== 'low' && (
                  <span className="ml-1.5 text-primary/70">
                    (suggested: {MEMORY_TYPE_OPTIONS.find((o) => o.value === intakePending.suggestedType)?.label})
                  </span>
                )}
              </label>
              <select
                value={intakeType}
                onChange={(e) => setIntakeType(e.target.value as MemoryItemType)}
                className="w-full appearance-none text-xs font-medium text-foreground bg-background border border-input rounded-md px-2.5 py-1.5 cursor-pointer"
              >
                {MEMORY_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-muted/20">
              <CheckSquare className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-medium text-muted-foreground">Store in Account Intelligence</span>
              <span className="text-[9px] text-muted-foreground/60 ml-auto">Always</span>
            </div>

            <button
              type="button"
              onClick={() => setIntakeAddToDealPlan(!intakeAddToDealPlan)}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-muted/20 transition-colors"
            >
              {intakeAddToDealPlan
                ? <CheckSquare className="w-3.5 h-3.5 text-primary" />
                : <Square className="w-3.5 h-3.5 text-muted-foreground" />
              }
              <span className="text-[10px] font-medium text-foreground">Also add shortcut to Deal Plan</span>
            </button>

            <div>
              <label className="text-[10px] font-medium text-muted-foreground mb-1 block">Tags (optional, comma-separated)</label>
              <Input value={intakeTags} onChange={(e) => setIntakeTags(e.target.value)} placeholder="e.g. security, Q3, priority" className="h-7 text-[10px]" />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleIntakeSave}
                disabled={!intakeTitle.trim()}
                className={cn(
                  'flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  intakeTitle.trim()
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                )}
              >
                Save
              </button>
              <button onClick={closeIntakeModal} className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== View All Drawer ===== */}
      {showAllDrawer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40" onClick={() => setShowAllDrawer(false)}>
          <div
            className="bg-card border border-border rounded-t-xl sm:rounded-xl w-full sm:w-[400px] max-h-[80vh] flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
              <p className="text-sm font-semibold text-foreground">All Evidence ({items.length})</p>
              <button onClick={() => setShowAllDrawer(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {items.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">No evidence items yet.</p>
              ) : (
                items.map((item) => (
                  <EvidenceItemRow
                    key={item.id}
                    item={item}
                    expanded={expandedItemId === item.id}
                    onToggle={() => setExpandedItemId(expandedItemId === item.id ? null : item.id)}
                    onDelete={() => handleDelete(item.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== Ask Teammate Modal ===== */}
      {showAskTeammate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowAskTeammate(false)}>
          <div className="bg-card border border-border rounded-xl p-4 w-80 space-y-3 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" /> Ask Teammate</p>
              <button onClick={() => setShowAskTeammate(false)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <Input value={teammateName} onChange={(e) => setTeammateName(e.target.value)} placeholder="Colleague name or email" className="h-8 text-xs" autoFocus />
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value as RequestType)}
              className="w-full appearance-none text-xs font-medium text-foreground bg-background border border-input rounded-md px-2.5 py-1.5 cursor-pointer"
            >
              {REQUEST_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
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
    </div>
  );
}
