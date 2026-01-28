import * as React from 'react';
import { useState } from 'react';
import { 
  Calendar, 
  Building2, 
  Play, 
  Pause,
  Bookmark, 
  Share2, 
  Sparkles,
  FileText,
  ChevronRight,
  MessageSquare,
  Plus,
  Link2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PrepLength = '1' | '3' | '10';
type MeetingType = 'intro' | 'discovery' | 'qbr' | 'renewal' | 'exec' | 'partner';

interface PrepSnapshot {
  headline: string;
  topThings: string[];
  talkTrack: string[];
  questions: string[];
  risks: string[];
  nextActions: string[];
  objections?: { objection: string; response: string }[];
  hypothesis?: string[];
  sources: { type: string; name: string; timestamp: string }[];
}

// Mock data for generated snapshot
const mockSnapshot: PrepSnapshot = {
  headline: "Sulzer is evaluating predictive maintenance vendors — position around uptime guarantees and quick ROI proof.",
  topThings: [
    "New CTO (Elena Rodriguez) started Q1 — comes from cloud-native background, likely to push modernization",
    "Active RFP for predictive maintenance platform — shortlist decision expected by end of Q1",
    "Budget pressure from board — any project needs 90-day ROI proof to proceed",
    "Current vendor (competitor) has delivery issues — opportunity to position on execution certainty",
    "Key stakeholder (VP Ops) attended automation summit — interested in AI integration roadmaps"
  ],
  talkTrack: [
    "\"We're seeing a lot of industrials prioritizing uptime guarantees over feature lists right now. What's driving that shift for you?\"",
    "\"With the new tech leadership settling in, are you expecting any changes to your vendor evaluation criteria?\"",
    "\"90-day proof of value is becoming standard. What metric would need to move in 12 weeks for this to be a win?\"",
  ],
  questions: [
    "What's your current baseline for unplanned downtime costs?",
    "How are you currently measuring maintenance ROI?",
    "What gives your team confidence in a vendor's ability to deliver?",
    "Are you evaluating partners based on uptime guarantees or software features?",
  ],
  risks: [
    "Budget cycle ends in March — deal may slip if not closed by Q1",
    "Incumbent has strong relationship with CFO — need exec sponsorship",
    "Integration complexity with legacy MES system could slow evaluation",
  ],
  nextActions: [
    "Schedule discovery call with VP Ops before automation summit follow-up",
    "Prepare 90-day value proof framework for CFO conversation",
  ],
  objections: [
    { 
      objection: "\"Your pricing is higher than the incumbent.\"",
      response: "Acknowledge, then pivot to total cost of ownership. \"That's fair — let's look at the full picture. What's the cost of one day of unplanned downtime for you?\""
    },
    {
      objection: "\"We don't have bandwidth for a new implementation.\"",
      response: "Reframe implementation as investment. \"What if we could show measurable value in 90 days with minimal IT lift? Would that change the conversation?\""
    },
    {
      objection: "\"We're happy with our current vendor.\"",
      response: "Probe for latent dissatisfaction. \"Understood. When you think about the next 2-3 years, what would need to change for you to re-evaluate?\""
    },
  ],
  hypothesis: [
    "Primary value driver: Reduce unplanned downtime by 15-20% through predictive maintenance",
    "Secondary opportunity: Consolidate 3 point solutions into unified platform, reducing integration overhead",
    "Expansion path: Start with 2 pilot plants, expand to 8 sites in EMEA by year-end",
  ],
  sources: [
    { type: "Story", name: "Competitor Pushes Sovereignty Hard", timestamp: "2d ago" },
    { type: "Briefing", name: "Industry Signals - Manufacturing", timestamp: "This week" },
    { type: "News", name: "Sulzer Q4 Earnings Call", timestamp: "Jan 15" },
    { type: "CRM", name: "Last meeting notes", timestamp: "Jan 10" },
  ],
};

const mockMeetings = [
  { id: '1', title: 'Sulzer - Discovery Call', time: 'Tomorrow, 2:00 PM', account: 'Sulzer AG' },
  { id: '2', title: 'First National - QBR', time: 'Thu, 10:00 AM', account: 'First National Bank' },
  { id: '3', title: 'BASF - Exec Review', time: 'Fri, 3:30 PM', account: 'BASF SE' },
];

const mockAccounts = [
  'Sulzer AG',
  'First National Bank', 
  'BASF SE',
  'Siemens Energy',
  'ThyssenKrupp',
];

const meetingTypes: { value: MeetingType; label: string }[] = [
  { value: 'intro', label: 'Intro' },
  { value: 'discovery', label: 'Discovery' },
  { value: 'qbr', label: 'QBR' },
  { value: 'renewal', label: 'Renewal' },
  { value: 'exec', label: 'Exec' },
  { value: 'partner', label: 'Partner' },
];

export function AccountPrepSection() {
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>('1');
  const [selectedAccount, setSelectedAccount] = useState<string | null>('Sulzer AG');
  const [meetingType, setMeetingType] = useState<MeetingType>('discovery');
  const [prepLength, setPrepLength] = useState<PrepLength>('3');
  const [isGenerating, setIsGenerating] = useState(false);
  const [snapshot, setSnapshot] = useState<PrepSnapshot | null>(null);
  const [activeTab, setActiveTab] = useState<'text' | 'audio'>('text');
  const [isPlaying, setIsPlaying] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [followUpText, setFollowUpText] = useState('');
  const [contextOpen, setContextOpen] = useState(false);
  const [contextText, setContextText] = useState('');

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setSnapshot(mockSnapshot);
      setIsGenerating(false);
    }, 1500);
  };

  const canGenerate = selectedMeeting || selectedAccount;
  
  const getBulletCount = (arr: string[], length: PrepLength): string[] => {
    const counts: Record<PrepLength, number> = { '1': 3, '3': 5, '10': arr.length };
    return arr.slice(0, counts[length]);
  };

  const showExtendedContent = prepLength === '10';

  // Check if calendar is "connected" (mock: we have meetings)
  const hasCalendar = mockMeetings.length > 0;

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Account Prep</h2>
        <p className="text-sm text-muted-foreground">
          Walk into the meeting sharp — in 1, 3, or 10 minutes.
        </p>
      </div>

      {/* Main Card */}
      <div className={cn(
        "rounded-2xl border border-border bg-card",
        "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.03)]"
      )}>
        {/* Controls Bar */}
        <div className="p-5 border-b border-border/60">
          <div className="flex flex-col gap-4">
            {/* Row 1: Selectors */}
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Meeting Selector */}
              <div className="flex-1 lg:flex-initial lg:w-[240px]">
                <Select value={selectedMeeting || ''} onValueChange={setSelectedMeeting}>
                  <SelectTrigger className="w-full h-10 bg-background border-border">
                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                    <SelectValue placeholder="Select meeting..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border z-50">
                    {mockMeetings.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-sm">{m.title}</span>
                          <span className="text-xs text-muted-foreground">{m.time}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!hasCalendar && (
                  <p className="mt-1.5 text-xs text-muted-foreground flex items-center gap-1">
                    <Link2 className="w-3 h-3" />
                    Connect calendar to auto-select meetings
                  </p>
                )}
              </div>

              {/* Account Selector */}
              <div className="flex-1 lg:flex-initial lg:w-[180px]">
                <Select value={selectedAccount || ''} onValueChange={setSelectedAccount}>
                  <SelectTrigger className="w-full h-10 bg-background border-border">
                    <Building2 className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                    <SelectValue placeholder="Select account..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border z-50">
                    {mockAccounts.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Meeting Type */}
              <Select value={meetingType} onValueChange={(v) => setMeetingType(v as MeetingType)}>
                <SelectTrigger className="w-full lg:w-[130px] h-10 bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border z-50">
                  {meetingTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Length Toggle */}
              <div className="flex items-center gap-0.5 p-1 rounded-lg bg-muted/40 border border-border/50">
                {(['1', '3', '10'] as PrepLength[]).map((len) => (
                  <button
                    key={len}
                    onClick={() => setPrepLength(len)}
                    className={cn(
                      "px-3.5 py-1.5 text-sm font-medium rounded-md transition-all",
                      prepLength === len
                        ? "bg-background text-foreground shadow-sm border border-border/50"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {len} min
                  </button>
                ))}
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!canGenerate || isGenerating}
                className={cn(
                  "flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl",
                  "bg-primary text-primary-foreground font-medium text-sm",
                  "shadow-sm hover:bg-primary/90 transition-all",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "lg:ml-auto"
                )}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Snapshot
                  </>
                )}
              </button>
            </div>

            {/* Row 2: Context + Trust Line */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              {/* Add Context Link */}
              <Collapsible open={contextOpen} onOpenChange={setContextOpen}>
                <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                  Add context (optional)
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <textarea
                    value={contextText}
                    onChange={(e) => setContextText(e.target.value)}
                    placeholder="E.g., They mentioned budget constraints last call. Focus on ROI..."
                    rows={2}
                    className={cn(
                      "w-full sm:w-[400px] px-3 py-2 rounded-lg text-sm",
                      "bg-background border border-border",
                      "placeholder:text-muted-foreground/70",
                      "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30",
                      "resize-none"
                    )}
                  />
                </CollapsibleContent>
              </Collapsible>

              {/* Trust Line */}
              <p className="text-[11px] text-muted-foreground/70">
                Built from: saved Stories, Briefings, latest news, and account context
              </p>
            </div>
          </div>
        </div>

        {/* Output Area */}
        {snapshot ? (
          <div className="p-5">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'text' | 'audio')}>
              <TabsList className="mb-4 bg-muted/40 p-1">
                <TabsTrigger value="text" className="gap-1.5 px-4">
                  <FileText className="w-3.5 h-3.5" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="audio" className="gap-1.5 px-4">
                  <Play className="w-3.5 h-3.5" />
                  Audio
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-6 mt-0">
                {/* Headline */}
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    {snapshot.headline}
                  </p>
                </div>

                {/* Structured Sections */}
                <SnapshotSection 
                  title="Top things to know" 
                  items={getBulletCount(snapshot.topThings, prepLength)} 
                  bullet="•"
                />

                <SnapshotSection 
                  title="Talk track (what to say)" 
                  items={getBulletCount(snapshot.talkTrack, prepLength)} 
                  bullet="•"
                  italic
                />

                <SnapshotSection 
                  title="Questions to ask" 
                  items={getBulletCount(snapshot.questions, prepLength)} 
                  bullet="•"
                />

                <SnapshotSection 
                  title="Risks / landmines" 
                  items={getBulletCount(snapshot.risks, prepLength)} 
                  bullet="⚠"
                  bulletClass="text-amber-500"
                />

                <SnapshotSection 
                  title="Next best action" 
                  items={snapshot.nextActions} 
                  bullet="→"
                  itemClass="font-medium"
                />

                {/* Extended Content (10 min only) */}
                {showExtendedContent && snapshot.objections && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Objection handling
                    </h4>
                    <div className="space-y-3">
                      {snapshot.objections.map((obj, i) => (
                        <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                          <p className="text-sm font-medium text-foreground mb-1.5">{obj.objection}</p>
                          <p className="text-sm text-muted-foreground leading-relaxed">{obj.response}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {showExtendedContent && snapshot.hypothesis && (
                  <SnapshotSection 
                    title="90-day opportunity hypothesis" 
                    items={snapshot.hypothesis} 
                    bullet="•"
                  />
                )}

                {/* Sources (collapsed) */}
                <Collapsible open={sourcesOpen} onOpenChange={setSourcesOpen}>
                  <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronRight className={cn(
                      "w-3.5 h-3.5 transition-transform",
                      sourcesOpen && "rotate-90"
                    )} />
                    Sources used ({snapshot.sources.length})
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2.5">
                    <div className="space-y-2 pl-5">
                      {snapshot.sources.map((src, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-medium uppercase tracking-wide">
                            {src.type}
                          </span>
                          <span>{src.name}</span>
                          <span className="text-muted-foreground/50">• {src.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </TabsContent>

              <TabsContent value="audio" className="mt-0">
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  {/* Audio Player */}
                  <div className="w-full max-w-md">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border/50">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center",
                          "bg-primary text-primary-foreground shadow-md",
                          "hover:bg-primary/90 transition-all"
                        )}
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5 ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: isPlaying ? '35%' : '0%' }}
                          />
                        </div>
                        <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                          <span>{isPlaying ? '1:03' : '0:00'}</span>
                          <span>{prepLength === '1' ? '1:00' : prepLength === '3' ? '3:00' : '10:00'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Narration length: {prepLength === '1' ? '1:00' : prepLength === '3' ? '3:00' : '10:00'}
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Actions */}
            <div className="mt-6 pt-5 border-t border-border/60 space-y-4">
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <ActionButton icon={Bookmark} label="Save to Account" />
                <ActionButton icon={Share2} label="Share" />
                <ActionButton icon={Sparkles} label="Send to Copilot" />
              </div>

              {/* Refinement Chips */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Refine:</span>
                {['Make shorter', 'Add competitor angle', 'Focus on stakeholder', 'Draft follow-up email'].map((chip) => (
                  <button
                    key={chip}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium",
                      "bg-muted/50 text-muted-foreground border border-border/50",
                      "hover:bg-muted hover:text-foreground transition-colors"
                    )}
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Follow-up Input */}
              <Collapsible open={followUpOpen} onOpenChange={setFollowUpOpen}>
                <CollapsibleTrigger className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Ask a follow-up about this snapshot
                  <ChevronRight className={cn(
                    "w-3.5 h-3.5 transition-transform",
                    followUpOpen && "rotate-90"
                  )} />
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={followUpText}
                      onChange={(e) => setFollowUpText(e.target.value)}
                      placeholder="E.g., What's the competitive positioning vs AWS?"
                      className={cn(
                        "flex-1 px-3 py-2 rounded-lg text-sm",
                        "bg-background border border-border",
                        "placeholder:text-muted-foreground/70",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
                      )}
                    />
                    <button className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium",
                      "bg-primary text-primary-foreground",
                      "hover:bg-primary/90 transition-colors"
                    )}>
                      Ask
                    </button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="p-10 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-muted/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-foreground mb-1">
              {canGenerate 
                ? "Ready to generate your meeting prep"
                : "Select a meeting or account to get started"
              }
            </p>
            <p className="text-xs text-muted-foreground">
              {canGenerate 
                ? "Click \"Generate Snapshot\" to create a personalized briefing"
                : "Choose from your upcoming meetings or search for an account"
              }
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

// Helper component for consistent section rendering
function SnapshotSection({ 
  title, 
  items, 
  bullet = '•',
  bulletClass = 'text-primary',
  itemClass = '',
  italic = false
}: { 
  title: string; 
  items: string[]; 
  bullet?: string;
  bulletClass?: string;
  itemClass?: string;
  italic?: boolean;
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className={cn("flex gap-2.5 text-sm text-foreground", itemClass)}>
            <span className={cn("mt-0.5 flex-shrink-0", bulletClass, !italic && "not-italic")}>{bullet}</span>
            <span className={italic ? "italic" : ""}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Helper component for action buttons
function ActionButton({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <button className={cn(
      "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium",
      "bg-muted/40 text-foreground border border-border/50",
      "hover:bg-muted transition-colors"
    )}>
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}
