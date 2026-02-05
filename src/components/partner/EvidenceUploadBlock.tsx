// Evidence Upload Block for Customer Brief form
// Replaces the old "Signal Quality" section

import { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Link2, 
  X as XIcon,
  Image,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EvidenceUpload, EvidenceLink, EvidenceState } from '@/data/partnerBriefData';

interface EvidenceUploadBlockProps {
  evidence: EvidenceState;
  onEvidenceChange: (evidence: EvidenceState) => void;
}

export function EvidenceUploadBlock({ evidence, onEvidenceChange }: EvidenceUploadBlockProps) {
  const [linkInput, setLinkInput] = useState('');
  const screenshotInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newUploads: EvidenceUpload[] = Array.from(files).map((file, idx) => ({
      id: `screenshot-${Date.now()}-${idx}`,
      type: 'screenshot' as const,
      filename: file.name,
      uploadedAt: new Date(),
    }));

    onEvidenceChange({
      ...evidence,
      uploads: [...evidence.uploads, ...newUploads],
    });

    // Reset input
    if (screenshotInputRef.current) {
      screenshotInputRef.current.value = '';
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newUploads: EvidenceUpload[] = Array.from(files).map((file, idx) => ({
      id: `document-${Date.now()}-${idx}`,
      type: 'document' as const,
      filename: file.name,
      uploadedAt: new Date(),
    }));

    onEvidenceChange({
      ...evidence,
      uploads: [...evidence.uploads, ...newUploads],
    });

    // Reset input
    if (documentInputRef.current) {
      documentInputRef.current.value = '';
    }
  };

  const handleAddLink = () => {
    if (!linkInput.trim()) return;

    const newLink: EvidenceLink = {
      id: `link-${Date.now()}`,
      url: linkInput.trim(),
      type: linkInput.includes('careers') ? 'careers' : 
            linkInput.includes('product') ? 'product' : 'website',
    };

    onEvidenceChange({
      ...evidence,
      links: [...evidence.links, newLink],
    });

    setLinkInput('');
  };

  const handleRemoveUpload = (id: string) => {
    onEvidenceChange({
      ...evidence,
      uploads: evidence.uploads.filter(u => u.id !== id),
    });
  };

  const handleRemoveLink = (id: string) => {
    onEvidenceChange({
      ...evidence,
      links: evidence.links.filter(l => l.id !== id),
    });
  };

  const hasEvidence = evidence.uploads.length > 0 || evidence.links.length > 0;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Upload className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-foreground">Evidence Upload (optional)</span>
        </div>
      </div>

      {/* Upload Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Screenshot Upload */}
        <div className="space-y-1">
          <input
            ref={screenshotInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleScreenshotUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => screenshotInputRef.current?.click()}
            className={cn(
              "w-full flex items-center gap-2 p-3 rounded-lg text-left transition-all",
              "border-2 border-dashed border-border hover:border-primary/50",
              "hover:bg-muted/30"
            )}
          >
            <Image className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground">Upload screenshots</p>
              <p className="text-[10px] text-muted-foreground truncate">
                LinkedIn, architecture, admin pages
              </p>
            </div>
          </button>
          <p className="text-[10px] text-muted-foreground/80 pl-1">
            Helps us identify applications and architecture patterns.
          </p>
        </div>

        {/* Document Upload */}
        <div className="space-y-1">
          <input
            ref={documentInputRef}
            type="file"
            accept=".pdf,.ppt,.pptx,.doc,.docx"
            multiple
            onChange={handleDocumentUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => documentInputRef.current?.click()}
            className={cn(
              "w-full flex items-center gap-2 p-3 rounded-lg text-left transition-all",
              "border-2 border-dashed border-border hover:border-primary/50",
              "hover:bg-muted/30"
            )}
          >
            <FileText className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground">Upload documents</p>
              <p className="text-[10px] text-muted-foreground truncate">
                Decks, meeting notes, proposals
              </p>
            </div>
          </button>
          <p className="text-[10px] text-muted-foreground/80 pl-1">
            Helps us detect licenses, platforms, and constraints.
          </p>
        </div>
      </div>

      {/* Link Input */}
      <div>
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
              placeholder="Customer website / careers / product pages"
              className={cn(
                "w-full h-9 pl-9 pr-3 rounded-lg text-sm",
                "bg-background border border-border",
                "placeholder:text-muted-foreground/60",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
              )}
            />
          </div>
          <button
            type="button"
            onClick={handleAddLink}
            disabled={!linkInput.trim()}
            className={cn(
              "px-3 h-9 rounded-lg text-xs font-medium transition-all",
              "bg-primary/10 text-primary hover:bg-primary/20",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            Add
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/80 mt-1 pl-1">
          We scan for technology signals and AI initiatives.
        </p>
      </div>

      {/* Uploaded Items List */}
      {hasEvidence && (
        <div className="space-y-2">
          {/* Screenshots */}
          {evidence.uploads.filter(u => u.type === 'screenshot').map((upload) => (
            <div
              key={upload.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 text-sm"
            >
              <Image className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1 truncate text-xs text-foreground">{upload.filename}</span>
              <button
                type="button"
                onClick={() => handleRemoveUpload(upload.id)}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive"
              >
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          {/* Documents */}
          {evidence.uploads.filter(u => u.type === 'document').map((upload) => (
            <div
              key={upload.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 text-sm"
            >
              <FileCheck className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1 truncate text-xs text-foreground">{upload.filename}</span>
              <button
                type="button"
                onClick={() => handleRemoveUpload(upload.id)}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive"
              >
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          {/* Links */}
          {evidence.links.map((link) => (
            <div
              key={link.id}
              className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 text-sm"
            >
              <Link2 className="w-4 h-4 text-muted-foreground" />
              <span className="flex-1 truncate text-xs text-foreground">{link.url}</span>
              <button
                type="button"
                onClick={() => handleRemoveLink(link.id)}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive"
              >
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}


      {/* Privacy Note */}
      <div className="flex items-start gap-2 text-[10px] text-muted-foreground">
        <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
        <span>Upload only what you're allowed to share. Redacted screenshots are fine.</span>
      </div>
    </div>
  );
}
