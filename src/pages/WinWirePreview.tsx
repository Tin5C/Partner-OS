import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Copy, Share2, Plus, Play, Pause, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/Tag';
import { BottomNav } from '@/components/BottomNav';
import { useState } from 'react';

export default function WinWirePreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [added, setAdded] = useState(false);

  // Get form data from navigation state, or use defaults
  const formData = location.state?.formData || {
    industry: 'Manufacturing',
    dealType: 'New Logo',
    sizeRange: '$1M-$2.5M',
    buyerPersona: 'VP Operations',
    accountName: 'GlobalMfg',
    trigger: 'Supply chain disruption forced them to modernize their legacy systems',
    objectionsOvercome: ['Price too high', 'In-house teams'],
    whyWeWonTags: ['Implementation speed', 'Industry experience'],
    talkTrack: 'We can have you operational in 12 weeks, not 12 months.',
    proofPoint: '30% faster time-to-value than TechCorp',
    landmine: 'Their procurement team will push for fixed pricing - stay firm on T&M',
  };

  const handleCopy = () => {
    const text = `
Win-Wire: ${formData.accountName || formData.industry} Deal

Context: ${formData.industry} | ${formData.dealType} | ${formData.sizeRange} | ${formData.buyerPersona}

Trigger: ${formData.trigger}

Why We Won: ${formData.whyWeWonTags.join(', ')}

Talk Track: "${formData.talkTrack}"

${formData.proofPoint ? `Proof Point: ${formData.proofPoint}` : ''}
${formData.landmine ? `Landmine: ${formData.landmine}` : ''}
    `.trim();
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToPlaylist = () => {
    setAdded(true);
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm safe-top px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold flex-1">Win-Wire Created</h1>
        </div>
      </header>

      <main className="px-4 space-y-6">
        {/* Success banner */}
        <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
            <Check className="w-5 h-5 text-success" />
          </div>
          <div>
            <p className="font-medium text-sm">Win-Wire generated successfully</p>
            <p className="text-xs text-muted-foreground">Audio ready to share with your team</p>
          </div>
        </div>

        {/* Win-Wire content */}
        <section className="bg-card rounded-2xl p-5 shadow-card space-y-4">
          <div>
            <h2 className="font-bold text-lg mb-2">
              {formData.accountName || formData.industry} Win: {formData.dealType}
            </h2>
            <div className="flex flex-wrap gap-2">
              <Tag>{formData.industry}</Tag>
              <Tag>{formData.sizeRange}</Tag>
              <Tag>{formData.buyerPersona}</Tag>
              {formData.whyWeWonTags.map((tag: string) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Context</p>
              <p className="text-sm">{formData.industry} | {formData.dealType} | {formData.sizeRange}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Trigger</p>
              <p className="text-sm">{formData.trigger}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Why We Won</p>
              <p className="text-sm">{formData.whyWeWonTags.join(', ')}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Talk Track</p>
              <p className="text-sm font-medium">"{formData.talkTrack}"</p>
            </div>

            {formData.proofPoint && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Proof Point</p>
                <p className="text-sm">{formData.proofPoint}</p>
              </div>
            )}

            {formData.landmine && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Landmine</p>
                <p className="text-sm text-destructive">{formData.landmine}</p>
              </div>
            )}
          </div>
        </section>

        {/* Audio player */}
        <section className="bg-card rounded-2xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-medium text-sm">Audio Summary</p>
              <p className="text-xs text-muted-foreground">1:30 • Audio generated</p>
            </div>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-progress w-0 rounded-full" />
          </div>
        </section>

        {/* Actions */}
        <div className="space-y-3">
          <Button onClick={handleCopy} variant="outline" className="w-full">
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy talk track
              </>
            )}
          </Button>
          
          <Button variant="outline" className="w-full">
            <Share2 className="w-4 h-4 mr-2" />
            Share internally
          </Button>

          <Button 
            onClick={handleAddToPlaylist}
            disabled={added}
            className="w-full"
          >
            {added ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Added to Wins & References
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add to Wins & References
              </>
            )}
          </Button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
