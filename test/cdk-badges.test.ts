/* eslint-disable jest/expect-expect */
import { CdkBadges } from '../src'
import { App, Stack } from 'aws-cdk-lib'
import { Template } from 'aws-cdk-lib/assertions'

const blankApp = new App()
const blankStack = new Stack(blankApp)

new CdkBadges(blankStack, 'Badges', {})

const blankTemplate = Template.fromStack(blankStack)

describe('Cloudformation Template validation', () => {
  it('includes the lambda function', () => {
    blankTemplate.hasResourceProperties('AWS::Lambda::Function', {
      // Runtime: 'nodejs16.x',
    })
  })
})
