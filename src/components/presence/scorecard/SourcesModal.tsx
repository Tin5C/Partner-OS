import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Linkedin, Globe, FileText, Mic, Users, Upload, Link2, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SourcesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Source {
  id: string;
  type: 'linkedin' | 'website' | 'newsletter' | 'podcast' | 'speaker' | 'pdf';
  label: string;
  icon: React.ReactNode;
  value?: string;
  connected: boolean;
}

const DEFAULT_SOURCES: Source[] = [
  { id: 'linkedin', type: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-4 h-4" />, connected: false },
  { id: 'website', type: 'website', label: 'Personal website', icon: <Globe className="w-4 h-4" />, connected: false },
  { id: 'newsletter', type: 'newsletter', label: 'Newsletter', icon: <FileText className="w-4 h-4" />, connected: false },
  { id: 'podcast', type: 'podcast', label: 'Podcast', icon: <Mic className="w-4 h-4" />, connected: false },
  { id: 'speaker', type: 'speaker', label: 'Speaker page', icon: <Users className="w-4 h-4" />, connected: false },
  { id: 'pdf', type: 'pdf', label: 'Upload PDF', icon: <Upload className="w-4 h-4" />, connected: false },
];

export function SourcesModal({ open, onOpenChange }: SourcesModalProps) {
  const [sources, setSources] = useState<Source[]>(DEFAULT_SOURCES);
  const [editingSource, setEditingSource] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  const handleConnect = (sourceId: string) => {
    setEditingSource(sourceId);
    const source = sources.find(s => s.id === sourceId);
    setInputValue(source?.value || '');
  };

  const handleSaveSource = (sourceId: string) => {
    setSources(prev => prev.map(s => 
      s.id === sourceId 
        ? { ...s, value: inputValue, connected: !!inputValue }
        : s
    ));
    setEditingSource(null);
    setInputValue('');
  };

  const handleRemoveSource = (sourceId: string) => {
    setSources(prev => prev.map(s => 
      s.id === sourceId 
        ? { ...s, value: undefined, connected: false }
        : s
    ));
  };

  const connectedCount = sources.filter(s => s.connected).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Sources</DialogTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add sources to personalize the scan (UI only in MVP).
          </p>
        </DialogHeader>

        <div className="space-y-3 py-4">
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
                    <span className="text-muted-foreground">{source.icon}</span>
                    <span className="text-sm font-medium">{source.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {source.type === 'pdf' ? (
                      <div className="flex-1 flex items-center justify-center py-3 border border-dashed border-border rounded-lg text-xs text-muted-foreground">
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
                      {source.icon}
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
            {connectedCount} source{connectedCount !== 1 ? 's' : ''} connected (mock)
          </p>
          <Button size="sm" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
