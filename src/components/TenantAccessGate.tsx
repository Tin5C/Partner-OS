import { useState } from 'react';
import { Lock, ArrowRight, Headphones, Building2, User } from 'lucide-react';
import { useTenant } from '@/contexts/TenantContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TenantAccessGateProps {
  children: React.ReactNode;
}

export function TenantAccessGate({ children }: TenantAccessGateProps) {
  const { tenant, tenantType, isUnlocked, isLoading, error: tenantError, unlock } = useTenant();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // If tenant not found
  if (tenantError || !tenant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-xl font-bold">Access Not Found</h1>
          <p className="text-muted-foreground">
            This portal doesn't exist or you don't have access.
          </p>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  // If already unlocked, show children
  if (isUnlocked) {
    return <>{children}</>;
  }

  // Show password gate
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = unlock(password);
      if (!result.success) {
        setError(result.error || 'Invalid password');
      }
    } finally {
      setLoading(false);
    }
  };

  const TenantIcon = tenantType === 'partner' ? Building2 : User;

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

          {/* Access Gate */}
          <div className="bg-card rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <TenantIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{tenant.displayName}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {tenantType} Portal
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Enter access password</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className={cn(
                  'h-12',
                  error && 'border-destructive focus-visible:ring-destructive'
                )}
                autoComplete="current-password"
                autoFocus
              />

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full h-12"
                disabled={!password || loading}
              >
                {loading ? 'Checking...' : 'Continue'}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>
          </div>

          {/* Help text */}
          <p className="text-xs text-center text-muted-foreground">
            Contact your admin if you need access credentials.
          </p>

          {/* Demo hint */}
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground">
              <strong>Demo:</strong> Partner passwords are {'{slug}'}2025 (e.g., partnera2025)
              <br />
              Internal passwords are {'{name}'}123 (e.g., daniel123)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
