// AccountIntelligence Store — re-exports underlying data stores
// Writers should import from here; readers should use the resolver.

export {
  addMemoryItem,
  listMemoryItems,
  updateMemoryType,
  deleteMemoryItem,
  getReadinessScore,
  type AccountMemoryItem,
  type MemoryItemType,
  type EvidencePillar,
} from '@/data/partner/accountMemoryStore';

export {
  createAccountSignal,
  listAccountSignals,
  getAccountSignal,
  type AccountSignal,
} from '@/data/partner/accountSignalStore';

export {
  createObjection,
  listObjections,
  getObjection,
  type Objection,
} from '@/data/partner/objectionStore';

export {
  createContentRequest,
  listContentRequests,
  getContentRequest,
  answerContentRequest,
  cancelContentRequest,
  type ContentRequest,
} from '@/data/partner/contentRequestStore';

export {
  saveExtractorRun,
  listExtractorRuns,
  getExtractorRun,
  type ExtractorRun,
} from '@/data/partner/extractorRunStore';

export {
  listWeeklySignals,
  getWeeklySignal,
  type CuratedWeeklySignal,
} from '@/data/partner/weeklySignalStore';
