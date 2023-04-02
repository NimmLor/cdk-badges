import { getCfResourceCountBadge } from './cf-badges'
import { getCfBadgeKeys } from './filenames'
import { getCfStackResources, LambdaEnvironment, writeBadgeToS3 } from './utils'

const { STACK_NAME, BADGE_STYLES } = LambdaEnvironment

export const updateStackResourceCountBadge = async () => {
  const resources = await getCfStackResources(STACK_NAME)

  const badges: Array<{ filekey: string; svg: string }> = []

  for (const style of BADGE_STYLES) {
    badges.push(
      {
        filekey: getCfBadgeKeys(STACK_NAME, style).resourceCount,
        svg: getCfResourceCountBadge(resources.length, {}),
      },
      {
        filekey: getCfBadgeKeys(STACK_NAME, style).namedResourceCount,
        svg: getCfResourceCountBadge(resources.length, {
          label: `${STACK_NAME} Stack`,
        }),
      }
    )
  }

  await Promise.all(
    badges.map(
      async ({ filekey, svg }) => await writeBadgeToS3({ filekey, svg })
    )
  )
}
