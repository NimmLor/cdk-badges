import { getCfResourceCountBadge } from './cf-badges'
import { getCfBadgeKeys } from './filenames'
import { getCfStackResources, LambdaEnvironment, writeBadgeToS3 } from './utils'
import type { Format } from 'badge-maker'

const { STACK_NAME, BADGE_STYLES } = LambdaEnvironment

export const updateStackResourceCountBadge = async () => {
  const resources = await getCfStackResources(STACK_NAME)

  const badges: Array<{
    filekey: string
    label: string
    style: Format['style'] & string
    svg: string
  }> = []

  for (const style of BADGE_STYLES) {
    badges.push(
      {
        filekey: getCfBadgeKeys(STACK_NAME, style).resourceCount,
        label: `${STACK_NAME} Generic Stack Resource Count`,
        style,
        svg: getCfResourceCountBadge(resources.length, { style }),
      },
      {
        filekey: getCfBadgeKeys(STACK_NAME, style).namedResourceCount,
        label: `${STACK_NAME} Stack Resource Count`,
        style,
        svg: getCfResourceCountBadge(resources.length, {
          label: `${STACK_NAME} Stack`,
          style,
        }),
      }
    )
  }

  await Promise.all(
    badges.map(
      async ({ filekey, svg, label, style }) =>
        await writeBadgeToS3({ filekey, label, style, svg })
    )
  )
}
