// Signal Image Taxonomy — diverse images per category, rotated per card instance
// Each category has 5 variants to eliminate visual repetition

import vendorCloudInfra from '@/assets/signals/vendor-cloud-infra.jpg';
import vendorAiData from '@/assets/signals/vendor-ai-data.jpg';
import vendorDashboard from '@/assets/signals/vendor-dashboard.jpg';
import vendorDatacenter from '@/assets/signals/vendor-datacenter.jpg';
import vendorTerminal from '@/assets/signals/vendor-terminal.jpg';

import regParliament from '@/assets/signals/reg-parliament.jpg';
import regDocuments from '@/assets/signals/reg-documents.jpg';
import regInstitution from '@/assets/signals/reg-institution.jpg';
import regFramework from '@/assets/signals/reg-framework.jpg';
import regGavel from '@/assets/signals/reg-gavel.jpg';

import compMarketCharts from '@/assets/signals/comp-market-charts.jpg';
import compSplit from '@/assets/signals/comp-split.jpg';
import compStrategy from '@/assets/signals/comp-strategy.jpg';
import compRadar from '@/assets/signals/comp-radar.jpg';
import compPositioning from '@/assets/signals/comp-positioning.jpg';

import indFactory from '@/assets/signals/ind-factory.jpg';
import indTechnician from '@/assets/signals/ind-technician.jpg';
import indSwissSkyline from '@/assets/signals/ind-swiss-skyline.jpg';
import indWarehouse from '@/assets/signals/ind-warehouse.jpg';
import indElevator from '@/assets/signals/ind-elevator.jpg';

export type SignalCategory = 'Vendor' | 'Regulatory' | 'Competitive' | 'LocalMarket';

const CATEGORY_IMAGES: Record<SignalCategory, string[]> = {
  Vendor: [vendorCloudInfra, vendorAiData, vendorDashboard, vendorDatacenter, vendorTerminal],
  Regulatory: [regParliament, regDocuments, regInstitution, regFramework, regGavel],
  Competitive: [compMarketCharts, compSplit, compStrategy, compRadar, compPositioning],
  LocalMarket: [indFactory, indTechnician, indSwissSkyline, indWarehouse, indElevator],
};

// Category color tints (applied as overlay)
export const CATEGORY_TINTS: Record<SignalCategory, string> = {
  Vendor: 'bg-blue-500/10',
  Regulatory: 'bg-purple-500/10',
  Competitive: 'bg-gray-500/10',
  LocalMarket: 'bg-emerald-500/10',
};

// Deterministic rotation based on story ID hash
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getRotatedCategoryImage(category: SignalCategory, storyId: string): string {
  const images = CATEGORY_IMAGES[category];
  if (!images || images.length === 0) return CATEGORY_IMAGES.Vendor[0];
  const index = hashCode(storyId) % images.length;
  return images[index];
}

// Freshness helper
export function getTimeAgo(publishedAt: string): string {
  const now = Date.now();
  const pub = new Date(publishedAt).getTime();
  const diffMs = now - pub;
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffH < 1) return 'Just now';
  if (diffH < 24) return `${diffH}h ago`;
  const diffD = Math.floor(diffH / 24);
  if (diffD === 1) return '1d ago';
  return `${diffD}d ago`;
}
