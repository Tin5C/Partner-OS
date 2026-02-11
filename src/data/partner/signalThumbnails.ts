// Signal thumbnail mapping — maps signal IDs to visual anchors

import sigAzureSwiss from '@/assets/signals/sig-azure-swiss.jpg';
import sigEuMachinery from '@/assets/signals/sig-eu-machinery.jpg';
import sigCopilotField from '@/assets/signals/sig-copilot-field.jpg';
import sigFinopsAi from '@/assets/signals/sig-finops-ai.jpg';
import sigAiGovernance from '@/assets/signals/sig-ai-governance.jpg';

export const SIGNAL_THUMBNAILS: Record<string, string> = {
  'sig-sch-azure-swiss': sigAzureSwiss,
  'sig-sch-eu-machinery': sigEuMachinery,
  'sig-sch-copilot-field': sigCopilotField,
  'sig-sch-finops-ai': sigFinopsAi,
  'sig-sch-ai-governance': sigAiGovernance,
};

export function getSignalThumbnail(signalId: string): string | null {
  return SIGNAL_THUMBNAILS[signalId] ?? null;
}
