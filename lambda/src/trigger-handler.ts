import { getCfResourceCountBadge } from './cf-badges'
import { getBadgeKeys } from './filenames'
import {
  getCfStackResources,
  LambdaEnvironment,
  ServiceName,
  writeBadgeToS3,
} from './utils'
import type { Format } from 'badge-maker'

const { BADGE_STYLES } = LambdaEnvironment

export const updateStackResourceCountBadge = async (stackName) => {
  const resources = await getCfStackResources(stackName)

  const badges: Array<{
    filekey: string
    label: string
    style: Format['style'] & string
    svg: string
  }> = []

  for (const style of BADGE_STYLES) {
    badges.push(
      {
        filekey: getBadgeKeys(stackName, style).cf.resourceCount,
        label: `${stackName} Generic Stack Resource Count`,
        style,
        svg: getCfResourceCountBadge(resources.length, { style }),
      },
      {
        filekey: getBadgeKeys(stackName, style).cf.namedResourceCount,
        label: `${stackName} Stack Resource Count`,
        style,
        svg: getCfResourceCountBadge(resources.length, {
          label: `${stackName} Stack`,
          style,
        }),
      }
    )
  }

  await Promise.all(
    badges.map(
      async ({ filekey, svg, label, style }) =>
        await writeBadgeToS3({
          filekey,
          label,
          serviceName: ServiceName.CF,
          style,
          svg,
        })
    )
  )
}
