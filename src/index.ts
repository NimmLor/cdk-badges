import type { aws_lambda_nodejs } from 'aws-cdk-lib'
import {
  aws_events,
  aws_events_targets,
  aws_iam,
  aws_lambda,
  aws_s3,
  CfnOutput,
  Duration,
  Stack,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'

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
   * Wheter to show seconds in the time.
   *
   * @default false
   */
  readonly showSeconds?: boolean
  /**
   * The timezone to use when generating badges.
   *
   *
   * @example 'Europe/Vienna'
   * @default 'UTC'
   */
  readonly timezone?: string
}

/**
 * The style of the badge to generate.
 *
 * @default 'flat-square'
 */
export type BadgeStyle =
  | 'flat-square'
  | 'flat'
  | 'for-the-badge'
  | 'plastic'
  | 'social'

export interface CdkBadgesProps {
  /**
   * Whether to add a preview webapp to the stack.
   *
   * @default true
   */
  readonly addPreviewWebapp?: boolean
  /**
   * The arn of the stack that should be monitored for changes.
   */
  readonly additionalCfnStacks?: string[]

  /**
   * The style of the badge to generate.
   */
  readonly badgeStyle?: BadgeStyle

  /**
   * The cache control header to use when writing badges to S3.
   *
   * @default 'max-age=300, private'
   */
  readonly cacheControl?: string

  /**
   * The formatting of the timestamps used in the badges.
   */
  readonly localization?: LocalizationSettings
}

export class CdkBadges extends Construct {
  public lambdaHandler: aws_lambda_nodejs.NodejsFunction

  public hostingBucket: aws_s3.Bucket

  public constructor(scope: Stack, id: string, props: CdkBadgesProps) {
    super(scope, id)

    const {
      additionalCfnStacks,
      cacheControl,
      localization,
      badgeStyle,
      addPreviewWebapp,
    } = props

    this.hostingBucket = new aws_s3.Bucket(this, 'hostingBucket', {
      publicReadAccess: true,
    })

    this.lambdaHandler = new aws_lambda.Function(this, 'Handler', {
      code: aws_lambda.Code.fromAsset('lambda/dist'),
      description: 'Generate status badges for cdk resources.',
      environment: {
        BADGE_STYLE: badgeStyle ?? 'flat-square',
        BASE_URL: `https://${this.hostingBucket.bucketName}.s3.${
          Stack.of(this).region
        }.amazonaws.com`,
        BUCKET_NAME: this.hostingBucket.bucketName,
        CACHE_CONTROL: cacheControl ?? 'max-age=300, private',
        HOUR12: localization?.hour12?.toString() ?? 'false',
        LOCALE: localization?.locale ?? 'en-GB',
        SHOW_SECONDS: localization?.showSeconds?.toString() ?? 'false',
        STACK_NAME: Stack.of(this).stackName,
        TIMEZONE: localization?.timezone ?? 'UTC',
      },
      // functionName: `${Stack.of(this).stackName}-CdkBadges`,
      handler: 'index.handler',
      memorySize: 256,
      runtime: new aws_lambda.Runtime(
        'nodejs18.x',
        aws_lambda.RuntimeFamily.NODEJS
      ),
      timeout: Duration.seconds(10),
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
        actions: [
          's3:PutObject',
          's3:PutObjectAcl',
          's3:PutObjectTagging',
          's3:ListBucket',
        ],
        resources: [
          this.hostingBucket.bucketArn,
          `${this.hostingBucket.bucketArn}/*`,
        ],
      })
    )

    const eventRule = new aws_events.Rule(this, 'Rule', {
      eventPattern: {
        source: ['aws.cloudformation'],
      },
    })

    const target = new aws_events_targets.LambdaFunction(this.lambdaHandler, {
      maxEventAge: Duration.minutes(5),
      retryAttempts: 3,
    })

    eventRule.addTarget(target)

    if (addPreviewWebapp !== false) {
      const functionUrl = this.lambdaHandler.addFunctionUrl({
        authType: aws_lambda.FunctionUrlAuthType.NONE,
      })

      new CfnOutput(this, 'BadgeUrl', {
        value: functionUrl.url,
      })
    }

    new CfnOutput(this, 'BadgeBucket', {
      value: this.hostingBucket.bucketWebsiteUrl,
    })
  }
}
