import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, Check, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tag } from '@/components/Tag';
import { BottomNav } from '@/components/BottomNav';

const topicTags = [
  'Discovery', 'Demo', 'Negotiation', 'Closing', 'Prospecting',
  'Stakeholders', 'Competitive', 'Pricing', 'Technical', 'References'
];

interface Learning {
  id: string;
  whatHappened: string;
  lesson: string;
  howToApply: string;
  tags: string[];
}

export default function MonthlyLearnings() {
  const navigate = useNavigate();
  const [learnings, setLearnings] = useState<Learning[]>([
    { id: '1', whatHappened: '', lesson: '', howToApply: '', tags: [] }
  ]);
  const [submitted, setSubmitted] = useState(false);

  const addLearning = () => {
    if (learnings.length < 5) {
      setLearnings([
        ...learnings,
        { id: Date.now().toString(), whatHappened: '', lesson: '', howToApply: '', tags: [] }
      ]);
    }
  };

  const removeLearning = (id: string) => {
    if (learnings.length > 1) {
      setLearnings(learnings.filter(l => l.id !== id));
    }
  };

  const updateLearning = (id: string, field: keyof Learning, value: string | string[]) => {
    setLearnings(learnings.map(l => 
      l.id === id ? { ...l, [field]: value } : l
    ));
  };

  const toggleTag = (learningId: string, tag: string) => {
    const learning = learnings.find(l => l.id === learningId);
    if (!learning) return;
    
    const newTags = learning.tags.includes(tag)
      ? learning.tags.filter(t => t !== tag)
      : [...learning.tags, tag];
    
    updateLearning(learningId, 'tags', newTags);
  };

  const isValid = learnings.some(l => l.whatHappened && l.lesson);

  const handleSubmit = () => {
    setSubmitted(true);
  };

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
            <h1 className="text-lg font-bold">Learnings Shared</h1>
          </div>
        </header>

        <main className="px-4 py-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h2 className="font-semibold text-xl">Thanks for sharing!</h2>
            <p className="text-muted-foreground">
              Your learnings have been added to Team Learnings – January 2026.
            </p>
            <Button onClick={() => navigate('/playlist/team-learnings')}>
              View Team Learnings
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
          <div className="flex-1">
            <h1 className="text-lg font-bold">Monthly Learnings</h1>
            <p className="text-xs text-muted-foreground">January 2026</p>
          </div>
        </div>
      </header>

      <main className="px-4 space-y-6">
        {/* Intro */}
        <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm">Your team gets smarter when you share</p>
            <p className="text-xs text-muted-foreground">Add up to 3 quick learnings from this month.</p>
          </div>
        </div>

        {/* Learnings */}
        <div className="space-y-4">
          {learnings.map((learning, index) => (
            <div 
              key={learning.id}
              className="bg-card rounded-2xl p-5 shadow-card space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Learning {index + 1}</h3>
                {learnings.length > 1 && (
                  <button
                    onClick={() => removeLearning(learning.id)}
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">What happened?</label>
                <Textarea
                  placeholder="Describe the situation briefly..."
                  value={learning.whatHappened}
                  onChange={(e) => updateLearning(learning.id, 'whatHappened', e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">What did you learn?</label>
                <Textarea
                  placeholder="The key insight or lesson..."
                  value={learning.lesson}
                  onChange={(e) => updateLearning(learning.id, 'lesson', e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">How can others apply this?</label>
                <Textarea
                  placeholder="Actionable advice for teammates..."
                  value={learning.howToApply}
                  onChange={(e) => updateLearning(learning.id, 'howToApply', e.target.value)}
                  rows={2}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tags (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {topicTags.map((tag) => (
                    <Tag
                      key={tag}
                      variant={learning.tags.includes(tag) ? 'active' : 'outline'}
                      size="md"
                      onClick={() => toggleTag(learning.id, tag)}
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add another */}
        {learnings.length < 3 && (
          <Button variant="outline" onClick={addLearning} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add another learning
          </Button>
        )}

        {/* Submit */}
        <Button 
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full"
        >
          <Check className="w-4 h-4 mr-2" />
          Share with team
        </Button>
      </main>

      <BottomNav />
    </div>
  );
}
