import { getCfResourceCountBadge } from './cf-badges'
import { getCfBadgeKeys } from './filenames'
import { getCfStackResources, writeBadgeToS3 } from './utils'

const STACK_NAME = process.env.STACK_NAME

if (STACK_NAME === undefined || STACK_NAME === '')
  throw new Error('STACK_NAME is not defined.')

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
