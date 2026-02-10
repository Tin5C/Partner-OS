import { useNavigate } from 'react-router-dom';
import { Headphones, Building2, Sparkles, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TenantSelector() {
  const navigate = useNavigate();

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

          {/* Space Selection */}
          <div className="space-y-4">
            <div className="space-y-1">
              <Button
                variant="outline"
                onClick={() => navigate('/internal')}
                className={cn(
                  "w-full h-14 flex items-center justify-center gap-3",
                  "border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                )}
              >
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-medium">Internal Space</span>
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Password: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">internal2025</code>
              </p>
            </div>
            <div className="space-y-1">
              <Button
                variant="outline"
                onClick={() => navigate('/partner')}
                className={cn(
                  "w-full h-14 flex items-center justify-center gap-3",
                  "border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/5"
                )}
              >
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span className="font-medium">Partner Space</span>
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Password: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">partner2025</code>
              </p>
            </div>
            <div className="space-y-1">
              <Button
                variant="outline"
                onClick={() => navigate('/vendor')}
                className={cn(
                  "w-full h-14 flex items-center justify-center gap-3",
                  "border-violet-500/20 hover:border-violet-500/40 hover:bg-violet-500/5"
                )}
              >
                <Store className="w-5 h-5 text-violet-600" />
                <span className="font-medium">Vendor Channel</span>
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Password: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">vendor2025</code>
              </p>
            </div>
          </div>

          {/* Help text */}
          <p className="text-xs text-center text-muted-foreground">
            Select your access type to continue.
          </p>
        </div>
      </div>
    </div>
  );
}
