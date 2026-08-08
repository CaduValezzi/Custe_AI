/**
 * OpenAPI snapshot lists `tenant_id` as query; runtime uses `X-Tenant-Id`
 * (middleware adds it). Duplicate query satisfies generated types and is
 * ignored by FastAPI.
 */
export function tenantQuery(
  tenantId: string,
  extra?: Partial<{
    month: string | null | undefined
    month_key: string | null | undefined
    tag_key: string | null | undefined
    tag_value: string | null | undefined
    group_by_tag: string | null | undefined
    tag_keys: string | null | undefined
  }>,
): { query: Record<string, string> } {
  const query: Record<string, string> = { tenant_id: tenantId }
  if (extra?.month !== undefined && extra.month !== null && extra.month !== "") query.month = extra.month
  if (extra?.month_key !== undefined && extra.month_key !== null && extra.month_key !== "") query.month_key = extra.month_key
  if (extra?.tag_key !== undefined && extra.tag_key !== null && extra.tag_key !== "") query.tag_key = extra.tag_key
  if (extra?.tag_value !== undefined && extra.tag_value !== null && extra.tag_value !== "") query.tag_value = extra.tag_value
  if (extra?.group_by_tag !== undefined && extra.group_by_tag !== null && extra.group_by_tag !== "") query.group_by_tag = extra.group_by_tag
  if (extra?.tag_keys !== undefined && extra.tag_keys !== null && extra.tag_keys !== "") query.tag_keys = extra.tag_keys
  return { query }
}
