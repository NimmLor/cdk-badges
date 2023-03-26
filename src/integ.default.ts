import { CdkBadges } from '.'
import { App, Stack } from 'aws-cdk-lib'

const app = new App()
const stack = new Stack(app, 'BadgesIntegTestStack')

new CdkBadges(stack, 'Badges', {
  localization: {
    hour12: false,
    locale: 'de-AT',
    showSeconds: false,
    timezone: 'Europe/Vienna',
  },
})
