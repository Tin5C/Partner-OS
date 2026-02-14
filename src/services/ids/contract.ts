// IDs Resolver Contract — canonical meta shape

export interface CanonicalMeta {
  hubOrgId: string;
  focusId: string;
  vendorId: string;
  weekKey: string; // ISO week YYYY-Www
}

/** Loose input shape accepting any of the known ID field names */
export interface CanonicalMetaInput {
  hub_org_id?: string;
  hubOrgId?: string;
  focusId?: string;
  account_id?: string;
  vendor_id?: string;
  primaryVendorId?: string;
  weekKey?: string;
  timeKey?: string;
  weekOf?: string;
  week_of?: string;
}
