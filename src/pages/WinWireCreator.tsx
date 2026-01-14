import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tag } from '@/components/Tag';
import { BottomNav } from '@/components/BottomNav';
import { cn } from '@/lib/utils';

const industries = ['Manufacturing', 'Financial Services', 'Healthcare', 'Retail', 'Technology'];
const dealTypes = ['New Logo', 'Expansion', 'Renewal', 'Competitive Displacement'];
const sizeRanges = ['<$500K', '$500K-$1M', '$1M-$2.5M', '$2.5M-$5M', '>$5M'];
const buyerPersonas = ['CIO/CTO', 'VP Engineering', 'VP Operations', 'CFO', 'Line of Business'];
const objections = [
  'Price too high',
  'Happy with current vendor',
  'In-house teams',
  'Bad past experience',
  'Timing not right',
  'Need to think about it',
];
const whyWeWon = [
  'Technical expertise',
  'Implementation speed',
  'Industry experience',
  'Total cost of ownership',
  'Reference customers',
  'Executive relationships',
];

interface FormData {
  // Step 1
  industry: string;
  dealType: string;
  sizeRange: string;
  buyerPersona: string;
  accountName: string;
  // Step 2
  trigger: string;
  objectionsOvercome: string[];
  whyWeWonTags: string[];
  // Step 3
  talkTrack: string;
  proofPoint: string;
  landmine: string;
}

export default function WinWireCreator() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    industry: '',
    dealType: '',
    sizeRange: '',
    buyerPersona: '',
    accountName: '',
    trigger: '',
    objectionsOvercome: [],
    whyWeWonTags: [],
    talkTrack: '',
    proofPoint: '',
    landmine: '',
  });

  const toggleArrayItem = (field: 'objectionsOvercome' | 'whyWeWonTags', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }));
  };

  const canProceed = () => {
    if (step === 1) {
      return formData.industry && formData.dealType && formData.sizeRange && formData.buyerPersona;
    }
    if (step === 2) {
      return formData.trigger && formData.whyWeWonTags.length > 0;
    }
    if (step === 3) {
      return formData.talkTrack;
    }
    return true;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Generate win-wire (in real app, this would submit)
      navigate('/win-wire/preview', { state: { formData } });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm safe-top px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold">Create Win-Wire</h1>
            <p className="text-xs text-muted-foreground">Step {step} of 3</p>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="px-4 mb-6">
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      <main className="px-4 space-y-6">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-semibold text-lg">Deal Basics</h2>
              <p className="text-sm text-muted-foreground">Tell us about the win</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Industry</label>
                <div className="flex flex-wrap gap-2">
                  {industries.map((ind) => (
                    <Tag
                      key={ind}
                      variant={formData.industry === ind ? 'active' : 'outline'}
                      size="md"
                      onClick={() => setFormData(prev => ({ ...prev, industry: ind }))}
                    >
                      {ind}
                    </Tag>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Deal Type</label>
                <div className="flex flex-wrap gap-2">
                  {dealTypes.map((type) => (
                    <Tag
                      key={type}
                      variant={formData.dealType === type ? 'active' : 'outline'}
                      size="md"
                      onClick={() => setFormData(prev => ({ ...prev, dealType: type }))}
                    >
                      {type}
                    </Tag>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Deal Size</label>
                <div className="flex flex-wrap gap-2">
                  {sizeRanges.map((size) => (
                    <Tag
                      key={size}
                      variant={formData.sizeRange === size ? 'active' : 'outline'}
                      size="md"
                      onClick={() => setFormData(prev => ({ ...prev, sizeRange: size }))}
                    >
                      {size}
                    </Tag>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Buyer Persona</label>
                <div className="flex flex-wrap gap-2">
                  {buyerPersonas.map((persona) => (
                    <Tag
                      key={persona}
                      variant={formData.buyerPersona === persona ? 'active' : 'outline'}
                      size="md"
                      onClick={() => setFormData(prev => ({ ...prev, buyerPersona: persona }))}
                    >
                      {persona}
                    </Tag>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Account Name (optional)</label>
                <Input
                  placeholder="e.g., Acme Corp"
                  value={formData.accountName}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="font-semibold text-lg">Deal Story</h2>
              <p className="text-sm text-muted-foreground">What made this win happen?</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">What triggered this deal?</label>
                <Textarea
                  placeholder="e.g., Supply chain disruption forced them to modernize..."
                  value={formData.trigger}
                  onChange={(e) => setFormData(prev => ({ ...prev, trigger: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Objections you overcame</label>
                <div className="flex flex-wrap gap-2">
                  {objections.map((obj) => (
                    <Tag
                      key={obj}
                      variant={formData.objectionsOvercome.includes(obj) ? 'active' : 'outline'}
                      size="md"
                      onClick={() => toggleArrayItem('objectionsOvercome', obj)}
                    >
                      {obj}
                    </Tag>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Why we won</label>
                <div className="flex flex-wrap gap-2">
                  {whyWeWon.map((reason) => (
                    <Tag
                      key={reason}
                      variant={formData.whyWeWonTags.includes(reason) ? 'active' : 'outline'}
                      size="md"
                      onClick={() => toggleArrayItem('whyWeWonTags', reason)}
                    >
                      {reason}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="font-semibold text-lg">Make It Reusable</h2>
              <p className="text-sm text-muted-foreground">Help others learn from this win</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Key talk track</label>
                <Textarea
                  placeholder="The one line that resonated most with the buyer..."
                  value={formData.talkTrack}
                  onChange={(e) => setFormData(prev => ({ ...prev, talkTrack: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Proof point used (optional)</label>
                <Input
                  placeholder="e.g., 30% faster implementation than TechCorp"
                  value={formData.proofPoint}
                  onChange={(e) => setFormData(prev => ({ ...prev, proofPoint: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Landmine to avoid (optional)</label>
                <Input
                  placeholder="What almost went wrong or what to watch out for"
                  value={formData.landmine}
                  onChange={(e) => setFormData(prev => ({ ...prev, landmine: e.target.value }))}
                />
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full"
        >
          {step === 3 ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Generate Win-Wire
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </main>

      <BottomNav />
    </div>
  );
}
