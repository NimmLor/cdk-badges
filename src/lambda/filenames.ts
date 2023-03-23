export const getCfBadgeKeys = (stackName = 'default') => ({
  namedStatus: `cf/${stackName}/named-status-named.svg`,
  namedStatusDetailed: `cf/${stackName}/named-status-detailed.svg`,
  status: `cf/${stackName}/status.svg`,
  statusDetailed: `cf/${stackName}/status-detailed.svg`,
})
