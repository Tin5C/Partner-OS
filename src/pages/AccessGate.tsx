import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Headphones, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export default function AccessGate() {
  const [selectedUser, setSelectedUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, availableUsers } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedUser) {
      setError('Select a user.');
      return;
    }

    setLoading(true);

    try {
      const result = await login(selectedUser, password);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Login failed.');
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
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Select your profile</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User dropdown */}
              <div className="space-y-2">
                <Label htmlFor="user-select">Profile</Label>
                <Select value={selectedUser} onValueChange={(value) => {
                  setSelectedUser(value);
                  setError('');
                }}>
                  <SelectTrigger id="user-select" className="h-12">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers.map((user) => (
                      <SelectItem key={user.key} value={user.key}>
                        {user.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Password input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
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
                />
              </div>

              {/* Error message */}
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full h-12"
                disabled={!selectedUser || loading}
              >
                {loading ? 'Checking...' : 'Continue'}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>
          </div>

          {/* Help text */}
          <p className="text-xs text-center text-muted-foreground">
            MVP access — ask admin for your password.
          </p>

          {/* Demo passwords hint */}
          <div className="bg-muted/50 rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground">
              <strong>Demo:</strong> Password is {'{name}'}123 (e.g., daniel123)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
