export const getCfBadgeKeys = (stackName = 'default') => ({
  status: `cf/${stackName}/status.svg`,
  statusDetailed: `cf/${stackName}/status-detailed.svg`,
})
