// DealPlanning Store — re-exports

export {
  getDealPlan,
  listDealPlans,
  promoteSignalsToDealPlan,
  removePromotedSignal,
  type DealPlan,
  type PromotedSignal,
} from '@/data/partner/dealPlanStore';

export {
  scoreServicePacks,
  SERVICE_PACKS,
  type ScoredPack,
  type ScoringInput,
  type ServicePack,
} from '@/data/partner/servicePackStore';

export {
  listByFocusId as listInboxItems,
  addItem as addInboxItem,
  removeItem as removeInboxItem,
  deriveImpactArea,
  makeInboxItemId,
  type DealPlanningInboxItem,
} from '@/data/partner/dealPlanningInboxStore';

export {
  getTags as getSignalTags,
  addTags as addSignalTags,
  clearTags as clearSignalTags,
} from '@/data/partner/dealPlanningSignalTagsStore';
