export const getCfBadgeKeys = (stackName = 'default') => ({
  namedResourceCount: `cf/${stackName}/named-resource-count.svg`,
  namedStatus: `cf/${stackName}/named-status-named.svg`,
  namedStatusDetailed: `cf/${stackName}/named-status-detailed.svg`,
  resourceCount: `cf/${stackName}/resource-count.svg`,
  status: `cf/${stackName}/status.svg`,
  statusDetailed: `cf/${stackName}/status-detailed.svg`,
})
