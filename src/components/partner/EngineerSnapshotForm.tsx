// Engineer Snapshot Form
// Inputs for engineer persona capability assessment

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Check, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  EngineerProfile,
  ENGINEER_ROLES,
  ENGINEER_SOLUTION_AREAS,
} from '@/data/partnerCapabilityData';

interface EngineerSnapshotFormProps {
  profile: Partial<EngineerProfile>;
  onChange: (profile: Partial<EngineerProfile>) => void;
}

export function EngineerSnapshotForm({ profile, onChange }: EngineerSnapshotFormProps) {
  const [certInput, setCertInput] = useState('');

  const toggleRole = (role: string) => {
    const current = profile.roles || [];
    const updated = current.includes(role)
      ? current.filter(r => r !== role)
      : [...current, role];
    onChange({ ...profile, roles: updated });
  };

  const toggleSolutionArea = (area: string) => {
    const current = profile.solutionAreas || [];
    const updated = current.includes(area)
      ? current.filter(a => a !== area)
      : [...current, area];
    onChange({ ...profile, solutionAreas: updated });
  };

  const addCertification = () => {
    if (certInput.trim()) {
      const current = profile.certifications || [];
      if (!current.includes(certInput.trim())) {
        onChange({ ...profile, certifications: [...current, certInput.trim()] });
      }
      setCertInput('');
    }
  };

  const removeCertification = (cert: string) => {
    const current = profile.certifications || [];
    onChange({ ...profile, certifications: current.filter(c => c !== cert) });
  };

  const handleDeliveryUpload = (type: 'architecture' | 'runbook' | 'design-doc') => {
    // Mock upload - in real implementation this would handle file upload
    const current = profile.deliveryProof || [];
    const newProof = { type, filename: `${type}-example.pdf` };
    onChange({ ...profile, deliveryProof: [...current, newProof] });
  };

  return (
    <div className="space-y-5">
      {/* Roles */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Your roles
        </label>
        <div className="flex flex-wrap gap-2">
          {ENGINEER_ROLES.map((role) => (
            <button
              key={role}
              onClick={() => toggleRole(role)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                "border",
                profile.roles?.includes(role)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary/50"
              )}
            >
              {profile.roles?.includes(role) && (
                <Check className="w-3 h-3 inline mr-1" />
              )}
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Solution areas */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Solution areas
        </label>
        <div className="flex flex-wrap gap-2">
          {ENGINEER_SOLUTION_AREAS.map((area) => (
            <button
              key={area}
              onClick={() => toggleSolutionArea(area)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                "border",
                profile.solutionAreas?.includes(area)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary/50"
              )}
            >
              {profile.solutionAreas?.includes(area) && (
                <Check className="w-3 h-3 inline mr-1" />
              )}
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div>
        <label className="text-sm font-medium text-foreground block mb-2">
          Certifications
        </label>
        <div className="flex items-center gap-2 mb-2">
          <Input
            value={certInput}
            onChange={(e) => setCertInput(e.target.value)}
            placeholder="e.g., AZ-305, DP-203"
            className="text-sm h-9 flex-1"
            onKeyDown={(e) => e.key === 'Enter' && addCertification()}
          />
          <Button 
            size="sm" 
            variant="outline" 
            className="h-9 gap-1.5"
            onClick={addCertification}
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </Button>
        </div>
        {profile.certifications && profile.certifications.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {profile.certifications.map((cert) => (
              <span 
                key={cert} 
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 text-primary text-xs"
              >
                {cert}
                <button 
                  onClick={() => removeCertification(cert)}
                  className="hover:text-primary/70"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Delivery proof */}
      <div className="p-4 rounded-xl border border-border bg-muted/20">
        <h4 className="text-sm font-medium text-foreground mb-3">
          Proof of delivery
        </h4>
        <p className="text-xs text-muted-foreground mb-3">
          Reference architectures, runbooks, design docs
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Architecture */}
          <button 
            onClick={() => handleDeliveryUpload('architecture')}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-lg",
              "border border-dashed border-border",
              "hover:border-primary/50 hover:bg-muted/30 transition-colors",
              profile.deliveryProof?.some(p => p.type === 'architecture') && "border-primary/50 bg-primary/5"
            )}
          >
            <Upload className="w-5 h-5 text-muted-foreground mb-2" />
            <span className="text-xs text-foreground">Architecture</span>
            {profile.deliveryProof?.some(p => p.type === 'architecture') && (
              <span className="text-[10px] text-primary mt-1">✓ Uploaded</span>
            )}
          </button>

          {/* Runbook */}
          <button 
            onClick={() => handleDeliveryUpload('runbook')}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-lg",
              "border border-dashed border-border",
              "hover:border-primary/50 hover:bg-muted/30 transition-colors",
              profile.deliveryProof?.some(p => p.type === 'runbook') && "border-primary/50 bg-primary/5"
            )}
          >
            <Upload className="w-5 h-5 text-muted-foreground mb-2" />
            <span className="text-xs text-foreground">Runbook</span>
            {profile.deliveryProof?.some(p => p.type === 'runbook') && (
              <span className="text-[10px] text-primary mt-1">✓ Uploaded</span>
            )}
          </button>

          {/* Design doc */}
          <button 
            onClick={() => handleDeliveryUpload('design-doc')}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-lg",
              "border border-dashed border-border",
              "hover:border-primary/50 hover:bg-muted/30 transition-colors",
              profile.deliveryProof?.some(p => p.type === 'design-doc') && "border-primary/50 bg-primary/5"
            )}
          >
            <Upload className="w-5 h-5 text-muted-foreground mb-2" />
            <span className="text-xs text-foreground">Design Doc</span>
            {profile.deliveryProof?.some(p => p.type === 'design-doc') && (
              <span className="text-[10px] text-primary mt-1">✓ Uploaded</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
