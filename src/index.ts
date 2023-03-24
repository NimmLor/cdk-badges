import {
  aws_events,
  aws_events_targets,
  aws_iam,
  aws_lambda,
  aws_lambda_nodejs,
  aws_s3,
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
// export interface PipelineProps {
//   [key: string]: aws_codepipeline.Pipeline
// }

export interface LocalizationSettings {
  /**
   * Whether to use 12 hour time format.
   *
   * @default false
   */
  readonly hour12?: boolean
  /**
   * The locale to use when generating badges.
   *
   * @example 'de-DE'
   * @example 'de-AT'
   * @default 'en-GB'
   */
  readonly locale?: string
  /**
   * The timezone to use when generating badges.
   *
   *
   * @example 'Europe/Vienna'
   * @default 'UTC'
   */
  readonly timezone?: string
}

export interface CdkBadgesProps {
  /**
   * The arn of the stack that should be monitored for changes.
   */
  readonly additionalCfnStacks?: string[]
  /**
   * The cache control header to use when writing badges to S3.
   *
   * @default 'max-age=300, private'
   */
  readonly cacheControl?: string

  readonly localization?: LocalizationSettings
}

export class CdkBadges extends Construct {
  public lambdaHandler: aws_lambda_nodejs.NodejsFunction

  public hostingBucket: aws_s3.Bucket

  public constructor(scope: Stack, id: string, props: CdkBadgesProps) {
    super(scope, id)

    const { additionalCfnStacks, cacheControl, localization } = props

    this.hostingBucket = new aws_s3.Bucket(this, 'hostingBucket', {
      publicReadAccess: true,
      websiteIndexDocument: 'index.html',
    })

    this.lambdaHandler = new aws_lambda_nodejs.NodejsFunction(this, 'handler', {
      bundling: {
        externalModules: ['@aws-sdk/*'],
      },
      description: 'Generate status badges for cdk resources.',
      environment: {
        BUCKET_NAME: this.hostingBucket.bucketName,
        CACHE_CONTROL: cacheControl ?? 'max-age=300, private',
        HOUR12: localization?.hour12?.toString() ?? 'false',
        LOCALE: localization?.locale ?? 'en-GB',
        STACK_NAME: Stack.of(this).stackName,
        TIMEZONE: localization?.timezone ?? 'UTC',
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
        actions: [
          'cloudformation:DescribeStacks',
          'cloudformation:DescribeStackResources',
        ],
        resources: [Stack.of(this).stackId, ...(additionalCfnStacks ?? [])],
      })
    )

    this.lambdaHandler.addToRolePolicy(
      new aws_iam.PolicyStatement({
        actions: ['s3:PutObject', 's3:PutObjectAcl', 's3:PutObjectTagging'],
        resources: [`${this.hostingBucket.bucketArn}/*`],
      })
    )

    const eventRule = new aws_events.Rule(this, 'Rule', {
      eventPattern: {
        source: ['aws.cloudformation', 'aws.codepipeline'],
      },
    })

    const target = new aws_events_targets.LambdaFunction(this.lambdaHandler, {
      maxEventAge: Duration.minutes(5),
      retryAttempts: 3,
    })

    eventRule.addTarget(target)

    new CfnOutput(this, 'BadgeUrl', {
      value: functionUrl.url,
    })
    new CfnOutput(this, 'BadgeBucket', {
      value: this.hostingBucket.bucketWebsiteUrl,
    })
  }
}
