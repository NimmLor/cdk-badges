export const getBadgeKeys = (resourceName: string, style: string) => ({
  cf: {
    namedResourceCount: `cf/${resourceName}/named-resource-count/${style}.svg`,
    namedStatus: `cf/${resourceName}/named-status-named/${style}.svg`,
    namedStatusDetailed: `cf/${resourceName}/named-status-detailed/${style}.svg`,
    resourceCount: `cf/${resourceName}/resource-count/${style}.svg`,
    status: `cf/${resourceName}/status/${style}.svg`,
    statusDetailed: `cf/${resourceName}/status-detailed/${style}.svg`,
  },
  codepipeline: {
    pipelineState: `codepipeline/${resourceName}/state/${style}.svg`,
    pipelineStateDetailed: `codepipeline/${resourceName}/state-detailed/${style}.svg`,
  },
})
