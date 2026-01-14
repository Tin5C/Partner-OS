import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tag } from '@/components/Tag';
import { BottomNav } from '@/components/BottomNav';

const categories = [
  'Account Briefing',
  'Competitive Intel',
  'Objection Handling',
  'Industry Trend',
  'Product Update',
  'Other',
];

export default function RequestBriefing() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    topic: '',
    context: '',
    urgency: 'normal' as 'normal' | 'urgent',
  });

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const isValid = formData.category && formData.topic;

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pb-32">
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm safe-top px-4 pt-4 pb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold">Request Sent</h1>
          </div>
        </header>

        <main className="px-4 py-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h2 className="font-semibold text-xl">Request submitted!</h2>
            <p className="text-muted-foreground">
              The enablement team will review your request and create a briefing if approved.
            </p>
            <Button onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm safe-top px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Request a Briefing</h1>
        </div>
      </header>

      <main className="px-4 space-y-6">
        {/* Intro */}
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm">Need a briefing on something specific?</p>
            <p className="text-xs text-muted-foreground">Tell us what you need and we'll create it.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Tag
                  key={cat}
                  variant={formData.category === cat ? 'active' : 'outline'}
                  size="md"
                  onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                >
                  {cat}
                </Tag>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Topic or Account Name</label>
            <Input
              placeholder="e.g., Acme Corp, TechCorp pricing, GDPR compliance"
              value={formData.topic}
              onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Context (optional)</label>
            <Textarea
              placeholder="Any additional context that would help us create a useful briefing..."
              value={formData.context}
              onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Urgency</label>
            <div className="flex gap-2">
              <Tag
                variant={formData.urgency === 'normal' ? 'active' : 'outline'}
                size="md"
                onClick={() => setFormData(prev => ({ ...prev, urgency: 'normal' }))}
              >
                Normal (1-2 weeks)
              </Tag>
              <Tag
                variant={formData.urgency === 'urgent' ? 'active' : 'outline'}
                size="md"
                onClick={() => setFormData(prev => ({ ...prev, urgency: 'urgent' }))}
              >
                Urgent (2-3 days)
              </Tag>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full"
        >
          <Check className="w-4 h-4 mr-2" />
          Submit Request
        </Button>
      </main>

      <BottomNav />
    </div>
  );
}
