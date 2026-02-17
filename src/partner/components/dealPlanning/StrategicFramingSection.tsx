// Strategic Framing — WHAT / HOW / WHY section for Business View
// Partner-only, replaces "Strategic Positioning" header text only within Deal Planning

import { useState, useEffect } from 'react';
import { Crosshair, Pencil, Check, Lightbulb, Route, Target } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import type { PromotedSignal } from '@/data/partner/dealPlanStore';

interface StrategicFramingSectionProps {
  promotedSignals: PromotedSignal[];
  topPackName: string | null;
  businessDrivers?: string;
  activePlayFraming?: { what: string; how: string; why: string } | null;
  /** Existing fields to preserve in collapsible Details */
  existingFields?: {
    whyNow: string;
    wedge: string;
    competitivePressure: string;
    execFraming: string;
    onWhyNowChange: (v: string) => void;
    onWedgeChange: (v: string) => void;
    onCompetitivePressureChange: (v: string) => void;
    onExecFramingChange: (v: string) => void;
  };
}

function FramingBlock({ label, icon, value, onChange, placeholder }: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const handleSave = () => {
    onChange(draft);
    setEditing(false);
  };

  return (
    <div className="p-3 rounded-lg bg-muted/20 border border-border/40 space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
          {icon} {label}
        </p>
        {!editing ? (
          <button onClick={() => { setDraft(value); setEditing(true); }} className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-0.5">
            <Pencil className="w-2.5 h-2.5" /> Edit
          </button>
        ) : (
          <button onClick={handleSave} className="text-[10px] text-primary hover:text-primary/80 flex items-center gap-0.5">
            <Check className="w-2.5 h-2.5" /> Save
          </button>
        )}
      </div>
      {editing ? (
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          className="text-xs min-h-[48px]"
        />
      ) : (
        <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
          {value || <span className="italic opacity-60">{placeholder}</span>}
        </p>
      )}
    </div>
  );
}

export function StrategicFramingSection({
  promotedSignals,
  topPackName,
  businessDrivers,
  activePlayFraming,
}: StrategicFramingSectionProps) {
  // Derive defaults from active play framing first, then promoted signals
  const defaultWhat = activePlayFraming?.what ?? (promotedSignals.length > 0
    ? promotedSignals.slice(0, 2).map((s) => s.snapshot.title).join('; ')
    : '');
  const defaultHow = activePlayFraming?.how ?? topPackName ?? '';
  const defaultWhy = activePlayFraming?.why ?? businessDrivers ?? (promotedSignals.length > 0
    ? promotedSignals[0]?.snapshot.soWhat ?? ''
    : '');

  const [whatText, setWhatText] = useState(defaultWhat);
  const [howText, setHowText] = useState(defaultHow);
  const [whyText, setWhyText] = useState(defaultWhy);

  // Update when an active play is selected
  useEffect(() => {
    if (activePlayFraming) {
      setWhatText(activePlayFraming.what);
      setHowText(activePlayFraming.how);
      setWhyText(activePlayFraming.why);
    }
  }, [activePlayFraming]);

  return (
    <div className="space-y-2.5">
      <FramingBlock
        label="WHAT"
        icon={<Target className="w-3 h-3" />}
        value={whatText}
        onChange={setWhatText}
        placeholder="What opportunity or problem are we addressing?"
      />
      <FramingBlock
        label="HOW"
        icon={<Route className="w-3 h-3" />}
        value={howText}
        onChange={setHowText}
        placeholder="How will we deliver value? (entry pack / approach)"
      />
      <FramingBlock
        label="WHY"
        icon={<Lightbulb className="w-3 h-3" />}
        value={whyText}
        onChange={setWhyText}
        placeholder="Why should the customer act now?"
      />
    </div>
  );
}
