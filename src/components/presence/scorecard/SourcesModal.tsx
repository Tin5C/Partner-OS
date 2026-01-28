import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Linkedin, Globe, FileText, Mic, Users, Upload, Link2, X, Check, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PersonSource } from '@/lib/presenceScorecardData';

interface SourcesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sources: PersonSource[];
  onConnect: (sourceId: string, value: string) => void;
  onDisconnect: (sourceId: string) => void;
  showRescanHint?: boolean;
  onRescan?: () => void;
}

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  linkedin: <Linkedin className="w-4 h-4" />,
  website: <Globe className="w-4 h-4" />,
  newsletter: <FileText className="w-4 h-4" />,
  podcast: <Mic className="w-4 h-4" />,
  speaker: <Users className="w-4 h-4" />,
  pdf: <Upload className="w-4 h-4" />,
};

export function SourcesModal({ 
  open, 
  onOpenChange, 
  sources, 
  onConnect, 
  onDisconnect,
  showRescanHint = false,
  onRescan,
}: SourcesModalProps) {
  const [editingSource, setEditingSource] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleConnect = (sourceId: string) => {
    setEditingSource(sourceId);
    const source = sources.find(s => s.id === sourceId);
    setInputValue(source?.value || '');
  };

  const handleSaveSource = (sourceId: string) => {
    onConnect(sourceId, inputValue);
    setEditingSource(null);
    setInputValue('');
  };

  const handleRemoveSource = (sourceId: string) => {
    onDisconnect(sourceId);
  };

  const connectedCount = sources.filter(s => s.connected).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Sources</DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add sources to personalize the scan and improve accuracy.
          </p>
        </DialogHeader>

        {/* Rescan hint */}
        {showRescanHint && connectedCount > 0 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <RefreshCw className="w-4 h-4 text-primary flex-shrink-0" />
            <p className="text-xs text-foreground flex-1">
              Sources updated! Re-run the scan to improve confidence.
            </p>
            {onRescan && (
              <Button size="sm" className="h-7 text-xs" onClick={onRescan}>
                Re-scan
              </Button>
            )}
          </div>
        )}

        <div className="space-y-3 py-2">
          {sources.map((source) => (
            <div 
              key={source.id}
              className={cn(
                "p-3 rounded-xl border transition-colors",
                source.connected 
                  ? "border-primary/30 bg-primary/5" 
                  : "border-border bg-card"
              )}
            >
              {editingSource === source.id ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{SOURCE_ICONS[source.type]}</span>
                    <span className="text-sm font-medium">{source.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {source.type === 'pdf' ? (
                      <div className="flex-1 flex items-center justify-center py-3 border border-dashed border-border rounded-lg text-xs text-muted-foreground cursor-pointer hover:bg-muted/30 transition-colors">
                        <Upload className="w-3.5 h-3.5 mr-1.5" />
                        Click to upload (UI only)
                      </div>
                    ) : (
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={`Enter ${source.label.toLowerCase()} URL`}
                        className="h-8 text-sm flex-1"
                      />
                    )}
                    <Button
                      size="sm"
                      className="h-8"
                      onClick={() => handleSaveSource(source.id)}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8"
                      onClick={() => setEditingSource(null)}
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "transition-colors",
                      source.connected ? "text-primary" : "text-muted-foreground"
                    )}>
                      {SOURCE_ICONS[source.type]}
                    </span>
                    <div>
                      <span className="text-sm font-medium">{source.label}</span>
                      {source.connected && source.value && (
                        <p className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                          {source.value}
                        </p>
                      )}
                    </div>
                  </div>
                  {source.connected ? (
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => handleConnect(source.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs text-destructive hover:text-destructive"
                        onClick={() => handleRemoveSource(source.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs"
                      onClick={() => handleConnect(source.id)}
                    >
                      <Link2 className="w-3 h-3 mr-1" />
                      Connect
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <p className="text-[10px] text-muted-foreground">
            {connectedCount} source{connectedCount !== 1 ? 's' : ''} connected
          </p>
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
