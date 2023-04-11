import { CdkBadges } from '.'
import { App, Stack } from 'aws-cdk-lib'
import type { Construct } from 'constructs'

const app = new App()

export const getTestStack = (scope: App | Construct) => {
  const stack = new Stack(scope, 'cdk-badges-Test')

  new CdkBadges(stack, 'Badges', {
    additionalCfnStacks: [
      'arn:aws:cloudformation:eu-central-1:123456789012:stack/MyStack/12345678-1234-1234-1234-123456789012',
    ],
    addPreviewWebapp: true,
    badgeStyles: ['flat-square', 'for-the-badge'],
    cacheControl: 'max-age=300',
    localization: {
      hour12: false,
      locale: 'de-AT',
      showSeconds: false,
      timezone: 'Europe/Vienna',
    },
  })
}

getTestStack(app)
