import type { aws_codepipeline } from 'aws-cdk-lib'
import {
  aws_events,
  aws_events_targets,
  aws_iam,
  aws_lambda,
  aws_lambda_nodejs,
  CfnOutput,
  Duration,
  Stack,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'

/**
 * A map of pipelines consisting of an id and the pipeline itself.
 * The id is used to identify pipelines and their badges.
 *
 * @example
 * {
 *  'webapp': webappPipeline,
 *  'backend': backendPipeline,
 * }
 */
export interface PipelineProps {
  [key: string]: aws_codepipeline.Pipeline
}

export interface CdkBadgesProps {
  readonly pipelines?: PipelineProps
}

export class CdkBadges extends Construct {
  public lambdaHandler: aws_lambda_nodejs.NodejsFunction

  public constructor(scope: Stack, id: string, props: CdkBadgesProps) {
    super(scope, id)

    if (props.pipelines) {
      throw new Error('Pipelines are not yet supported.')
    }

    this.lambdaHandler = new aws_lambda_nodejs.NodejsFunction(this, 'handler', {
      bundling: {
        externalModules: ['@aws-sdk/*'],
      },
      description: 'Generate status badges for cdk resources.',
      environment: {
        STACK_NAME: Stack.of(this).stackName,
      },
      functionName: `${Stack.of(this).stackName}-CdkBadges`,
      memorySize: 256,
      runtime: new aws_lambda.Runtime(
        'nodejs18.x',
        aws_lambda.RuntimeFamily.NODEJS
      ),
      timeout: Duration.seconds(10),
    })

    const functionUrl = this.lambdaHandler.addFunctionUrl({
      authType: aws_lambda.FunctionUrlAuthType.NONE,
    })

    this.lambdaHandler.addToRolePolicy(
      new aws_iam.PolicyStatement({
        actions: ['cloudformation:DescribeStacks'],
        resources: ['*'],
      })
    )

    new aws_events.Rule(this, 'Rule', {
      eventPattern: {
        source: ['aws.cloudformation', 'aws.codepipeline'],
      },
    })

    new CfnOutput(this, 'BadgeUrl', {
      exportName: 'BadgeUrl',
      value: functionUrl.url,
    })
  }
}
