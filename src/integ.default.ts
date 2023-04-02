import { CdkBadges } from '.'
import { App, Stack } from 'aws-cdk-lib'

const app = new App()
const stack = new Stack(app, 'Test')

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
