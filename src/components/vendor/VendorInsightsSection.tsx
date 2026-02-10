// Vendor Insights Section
// Shows partner engagement metrics

import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { useVendorData } from '@/contexts/VendorDataContext';

export function VendorInsightsSection() {
  const { provider } = useVendorData();
  const insights = provider.listInsights();

  const TrendIcon = (trend: 'up' | 'down' | 'flat') => {
    if (trend === 'up') return <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />;
    if (trend === 'down') return <TrendingDown className="w-3.5 h-3.5 text-destructive" />;
    return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  return (
    <section className="space-y-4">
      <SectionHeader
        title="Insights"
        subtitle="How partners are engaging with your content."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="rounded-xl border border-border bg-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              {TrendIcon(insight.trend)}
            </div>
            <p className="text-2xl font-bold text-foreground">
              {insight.value}
              <span className="text-xs font-normal text-muted-foreground ml-1">{insight.unit}</span>
            </p>
            <p className="text-xs font-medium text-foreground mt-1">{insight.metric}</p>
            <p className="text-[11px] text-muted-foreground">{insight.period}</p>
            {insight.isSimulated && (
              <p className="text-[10px] text-muted-foreground mt-1 italic">Demo data</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
