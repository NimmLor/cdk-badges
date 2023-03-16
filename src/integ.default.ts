import { CdkBadges } from '.'
import { App, Stack } from 'aws-cdk-lib'

const app = new App()
const stack = new Stack(app, 'BadgesIntegTestStack')

new CdkBadges(stack, 'Badges', {})
