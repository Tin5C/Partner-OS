import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Headphones } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function AccessGate() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(code);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid access code. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Headphones className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">Dialogue</h1>
            <p className="text-muted-foreground mt-1">Seller Enablement Audio Hub</p>
          </div>

          {/* Gate form */}
          <div className="bg-card rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Pilot access required</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter your access code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={cn(
                    'h-12 text-center text-lg font-mono tracking-widest uppercase',
                    error && 'border-destructive focus-visible:ring-destructive'
                  )}
                  autoComplete="off"
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-destructive text-center">{error}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12"
                disabled={!code.trim() || loading}
              >
                {loading ? 'Checking...' : 'Enter'}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>
          </div>

          {/* Help text */}
          <p className="text-xs text-center text-muted-foreground">
            Don't have an access code?{' '}
            <a href="mailto:enablement@company.com" className="text-primary hover:underline">
              Contact your enablement team
            </a>
          </p>

          {/* Demo codes hint */}
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground">
              <strong>Demo codes:</strong> PILOT2026 (seller) or ADMIN2026 (admin)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
