// OnDemand Store — re-exports

export {
  listBriefingArtifacts,
  getBriefingArtifact,
  createBriefingArtifact,
  type BriefingArtifactRecord,
  type BriefingArtifactType,
} from '@/data/partner/briefingArtifactStore';

export {
  getBriefingSelection,
  saveBriefingSelection,
  clearBriefingSelection,
  listBriefingSelections,
  type BriefingSelection,
} from '@/data/partner/briefingSelectionStore';

export {
  VENDOR_OPTIONS,
  INDUSTRY_OPTIONS,
  ACCOUNT_OPTIONS,
  COMPETITIVE_ANGLE_OPTIONS,
  type TaxonomyItem,
} from '@/data/partner/briefingTaxonomy';
