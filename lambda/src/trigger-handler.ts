import { getCfResourceCountBadge } from './cf-badges'
import { getCfBadgeKeys } from './filenames'
import { getCfStackResources, LambdaEnvironment, writeBadgeToS3 } from './utils'

const { STACK_NAME } = LambdaEnvironment

export const updateStackResourceCountBadge = async () => {
  const resources = await getCfStackResources(STACK_NAME)

  const badges: Array<{ filekey: string; svg: string }> = []

  badges.push(
    {
      filekey: getCfBadgeKeys(STACK_NAME).resourceCount,
      svg: getCfResourceCountBadge(resources.length, {}),
    },
    {
      filekey: getCfBadgeKeys(STACK_NAME).namedResourceCount,
      svg: getCfResourceCountBadge(resources.length, {
        label: `${STACK_NAME} Stack`,
      }),
    }
  )

  await Promise.all(
    badges.map(
      async ({ filekey, svg }) => await writeBadgeToS3({ filekey, svg })
    )
  )
}
