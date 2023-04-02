export const getCfBadgeKeys = (stackName: string, style: string) => ({
  namedResourceCount: `cf/${stackName}/named-resource-count/${style}.svg`,
  namedStatus: `cf/${stackName}/named-status-named/${style}.svg`,
  namedStatusDetailed: `cf/${stackName}/named-status-detailed/${style}.svg`,
  resourceCount: `cf/${stackName}/resource-count/${style}.svg`,
  status: `cf/${stackName}/status/${style}.svg`,
  statusDetailed: `cf/${stackName}/status-detailed/${style}.svg`,
})
