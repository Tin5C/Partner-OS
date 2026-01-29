import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Headphones, Building2, User, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getPartnerList, getInternalUserList } from '@/lib/tenantConfig';
import { cn } from '@/lib/utils';

export default function TenantSelector() {
  const navigate = useNavigate();
  const [selectedPartner, setSelectedPartner] = useState('');
  const [selectedUser, setSelectedUser] = useState('');

  const partners = getPartnerList();
  const internalUsers = getInternalUserList();

  const handlePartnerContinue = () => {
    if (selectedPartner) {
      // Use new unified route format
      navigate(`/partner/${selectedPartner}`);
    }
  };

  const handleInternalContinue = () => {
    if (selectedUser) {
      // Use new unified route format
      navigate(`/seller/${selectedUser}`);
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

          {/* Quick Access - New Space Routes */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/internal')}
              className={cn(
                "flex-1 h-12 flex items-center justify-center gap-2",
                "border-primary/20 hover:border-primary/40 hover:bg-primary/5"
              )}
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Internal Space</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/partner')}
              className={cn(
                "flex-1 h-12 flex items-center justify-center gap-2",
                "border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/5"
              )}
            >
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Partner Space</span>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or select tenant</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Selector Card */}
          <div className="bg-card rounded-2xl p-6 shadow-card">
            <Tabs defaultValue="partner" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="partner" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Partner
                </TabsTrigger>
                <TabsTrigger value="internal" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Internal
                </TabsTrigger>
              </TabsList>

              <TabsContent value="partner" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Select your organization
                  </label>
                  <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choose partner..." />
                    </SelectTrigger>
                    <SelectContent>
                      {partners.map((partner) => (
                        <SelectItem key={partner.slug} value={partner.slug}>
                          {partner.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handlePartnerContinue}
                  className="w-full h-12"
                  disabled={!selectedPartner}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </TabsContent>

              <TabsContent value="internal" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Select your profile
                  </label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Choose user..." />
                    </SelectTrigger>
                    <SelectContent>
                      {internalUsers.map((user) => (
                        <SelectItem key={user.slug} value={user.slug}>
                          {user.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleInternalContinue}
                  className="w-full h-12"
                  disabled={!selectedUser}
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </TabsContent>
            </Tabs>
          </div>

          {/* Help text */}
          <p className="text-xs text-center text-muted-foreground">
            Select your access type to continue to your personalized portal.
          </p>
        </div>
      </div>
    </div>
  );
}
