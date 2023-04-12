import { CdkBadges } from '.'
import { App, Stack } from 'aws-cdk-lib'
import type { Construct } from 'constructs'

const app = new App()

export const getTestStack = (scope: App | Construct, stackName: string) => {
  const stack = new Stack(scope, stackName)

  new CdkBadges(stack, 'Badges', {
    addPreviewWebapp: true,
    badgeStyles: ['flat-square', 'for-the-badge'],
    cacheControl: 'max-age=300',
    cloudformationCaptures: {
      captureAll: true,
      enabled: true,
    },
    codepipelineCaptures: {
      captureAll: true,
      enabled: true,
    },
    localization: {
      hour12: false,
      locale: 'de-AT',
      showSeconds: false,
      timezone: 'Europe/Vienna',
    },
  })
}

getTestStack(app, 'cdk-badges-Test')
