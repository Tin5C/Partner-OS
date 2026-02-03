// Extracted Signals Block for Customer Brief output
// Displays editable chips with confidence badges

import { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  X as XIcon, 
  Plus,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExtractedSignals, ExtractedSignal } from '@/data/partnerBriefData';

interface ExtractedSignalsBlockProps {
  signals: ExtractedSignals;
  onSignalsChange: (signals: ExtractedSignals) => void;
}

function ConfidenceBadge({ confidence }: { confidence: ExtractedSignal['confidence'] }) {
  return (
    <span className={cn(
      "text-[9px] font-medium px-1 py-0.5 rounded",
      confidence === 'High' && "bg-green-100 text-green-700",
      confidence === 'Medium' && "bg-amber-100 text-amber-700",
      confidence === 'Low' && "bg-red-100 text-red-700"
    )}>
      {confidence}
    </span>
  );
}

interface SignalChipProps {
  signal: ExtractedSignal;
  onConfirm: () => void;
  onRemove: () => void;
}

function SignalChip({ signal, onConfirm, onRemove }: SignalChipProps) {
  return (
    <div className={cn(
      "flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-all",
      signal.confirmed 
        ? "bg-primary/10 border border-primary/30" 
        : "bg-muted/50 border border-border"
    )}>
      <span className="text-foreground font-medium">{signal.label}</span>
      <ConfidenceBadge confidence={signal.confidence} />
      
      {!signal.confirmed ? (
        <button
          onClick={onConfirm}
          className="ml-1 p-0.5 rounded hover:bg-primary/10 text-primary transition-colors"
          title="Confirm signal"
        >
          <Check className="w-3 h-3" />
        </button>
      ) : (
        <Check className="w-3 h-3 text-primary ml-1" />
      )}
      
      <button
        onClick={onRemove}
        className="p-0.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
        title="Remove signal"
      >
        <XIcon className="w-3 h-3" />
      </button>
    </div>
  );
}

interface SignalGroupProps {
  title: string;
  signals: ExtractedSignal[];
  onConfirm: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: (label: string) => void;
}

function SignalGroup({ title, signals, onConfirm, onRemove, onAdd }: SignalGroupProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState('');

  const handleAdd = () => {
    if (newLabel.trim()) {
      onAdd(newLabel.trim());
      setNewLabel('');
      setIsAdding(false);
    }
  };

  return (
    <div>
      <p className="text-xs font-medium text-muted-foreground mb-2">{title}</p>
      <div className="flex flex-wrap gap-2">
        {signals.map((signal) => (
          <SignalChip
            key={signal.id}
            signal={signal}
            onConfirm={() => onConfirm(signal.id)}
            onRemove={() => onRemove(signal.id)}
          />
        ))}
        
        {isAdding ? (
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Add signal..."
              className="h-7 px-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/30 w-28"
              autoFocus
            />
            <button
              onClick={handleAdd}
              className="p-1 rounded hover:bg-primary/10 text-primary"
            >
              <Check className="w-3 h-3" />
            </button>
            <button
              onClick={() => { setIsAdding(false); setNewLabel(''); }}
              className="p-1 rounded hover:bg-muted text-muted-foreground"
            >
              <XIcon className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-muted-foreground border border-dashed border-border hover:border-primary/50 hover:text-primary transition-colors"
          >
            <Plus className="w-3 h-3" />
            Add
          </button>
        )}
      </div>
    </div>
  );
}

export function ExtractedSignalsBlock({ signals, onSignalsChange }: ExtractedSignalsBlockProps) {
  const hasSignals = signals.applications.length > 0 || 
                     signals.architecture.length > 0 || 
                     signals.licenses.length > 0;

  const handleConfirm = (category: keyof ExtractedSignals, id: string) => {
    const updated = { ...signals };
    updated[category] = updated[category].map(s => 
      s.id === id ? { ...s, confirmed: true } : s
    );
    onSignalsChange(updated);
  };

  const handleRemove = (category: keyof ExtractedSignals, id: string) => {
    const updated = { ...signals };
    updated[category] = updated[category].filter(s => s.id !== id);
    onSignalsChange(updated);
  };

  const handleAdd = (category: keyof ExtractedSignals, label: string) => {
    const updated = { ...signals };
    const newSignal: ExtractedSignal = {
      id: `manual-${Date.now()}`,
      label,
      confidence: 'High', // Manual entries are high confidence
      confirmed: true, // Manual entries are auto-confirmed
    };
    updated[category] = [...updated[category], newSignal];
    onSignalsChange(updated);
  };

  return (
    <div className="rounded-xl border border-border bg-muted/10 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Extracted Signals</h3>
      </div>

      {hasSignals ? (
        <div className="space-y-4">
          <SignalGroup
            title="Applications detected"
            signals={signals.applications}
            onConfirm={(id) => handleConfirm('applications', id)}
            onRemove={(id) => handleRemove('applications', id)}
            onAdd={(label) => handleAdd('applications', label)}
          />
          <SignalGroup
            title="Architecture patterns detected"
            signals={signals.architecture}
            onConfirm={(id) => handleConfirm('architecture', id)}
            onRemove={(id) => handleRemove('architecture', id)}
            onAdd={(label) => handleAdd('architecture', label)}
          />
          <SignalGroup
            title="License signals detected"
            signals={signals.licenses}
            onConfirm={(id) => handleConfirm('licenses', id)}
            onRemove={(id) => handleRemove('licenses', id)}
            onAdd={(label) => handleAdd('licenses', label)}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 text-sm text-muted-foreground">
          <AlertCircle className="w-4 h-4" />
          <span>No evidence uploaded yet — add evidence to extract signals</span>
        </div>
      )}
    </div>
  );
}
