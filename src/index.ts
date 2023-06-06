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
import * as path from 'path'

export interface LocalizationSettings {
  /**
   * Whether to use 12 hour time format.
   * @default false
   */
  readonly hour12?: boolean
  /**
   * The locale to use when generating badges.
   * @example 'de-DE'
   * @example 'de-AT'
   * @default 'en-GB'
   */
  readonly locale?: string
  /**
   * Wheter to show seconds in the time.
   * @default false
   */
  readonly showSeconds?: boolean
  /**
   * The timezone to use when generating badges.
   * @example 'Europe/Vienna'
   * @default 'UTC'
   */
  readonly timezone?: string

  /**
   * The format of the timezone to display.
   *
   * Sets the timeZoneName option of the Intl.DateTimeFormat constructor.
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters
   * @default 'none'
   */
  readonly timezoneDisplayFormat?:
    | 'long'
    | 'longGeneric'
    | 'longOffset'
    | 'none'
    | 'short'
    | 'shortGeneric'
    | 'shortOffset'
}

/**
 * The style of the badge to generate.
 * @default 'flat-square'
 */
export type BadgeStyle =
  | 'flat-square'
  | 'flat'
  | 'for-the-badge'
  | 'plastic'
  | 'social'

export interface CaptureSettings {
  /**
   * Whether to capture all pipelines in the account.
   * @default true
   */
  readonly captureAll?: boolean
  /**
   * Enable the codepipeline capture.
   * @default true
   */
  readonly enabled?: boolean
  /**
   * The name of the pipeline that should be monitored for changes.
   *
   * Must be set if captureAll is false.
   */
  readonly resourceArns?: string[]
}

export interface CdkBadgesProps {
  /**
   * Whether to add a preview webapp to the stack.
   * @default true
   */
  readonly addPreviewWebapp?: boolean
  /**
   * The style of the badge to generate.
   * @default ['flat-square', 'flat', 'for-the-badge', 'plastic']
   */
  readonly badgeStyles?: BadgeStyle[]

  /**
   * The cache control header to use when writing badges to S3.
   * @default 'max-age=300, private'
   */
  readonly cacheControl?: string

  /**
   * The settings for creating cloudformation badges.
   */
  readonly cloudformationCaptures?: CaptureSettings

  /**
   * The settings for creating codepipeline badges.
   * @default captureAll: true
   */
  readonly codepipelineCaptures?: CaptureSettings

  /**
   * The formatting of the timestamps used in the badges.
   */
  readonly localization?: LocalizationSettings
}

export class CdkBadges extends Construct {
  public lambdaHandler: aws_lambda_nodejs.NodejsFunction

  public hostingBucket: aws_s3.Bucket

  public functionUrl: aws_lambda.FunctionUrl | undefined

  public constructor(scope: Stack, id: string, props: CdkBadgesProps) {
    super(scope, id)

    const {
      cloudformationCaptures,
      cacheControl,
      localization,
      badgeStyles,
      addPreviewWebapp,
      codepipelineCaptures,
    } = props

    this.hostingBucket = new aws_s3.Bucket(this, 'hostingBucket', {
      blockPublicAccess: new aws_s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }),
      publicReadAccess: true,
    })

    const badgeStylesString = badgeStyles?.join(';')
    const defaultStyles = [
      'flat-square',
      'flat',
      'for-the-badge',
      'plastic',
    ].join(';')

    this.lambdaHandler = new aws_lambda.Function(this, 'Handler', {
      code: aws_lambda.Code.fromAsset(path.join(__dirname, '../lib/lambda')),
      description: 'Generate status badges for cdk resources.',
      environment: {
        BADGE_STYLES: badgeStylesString ?? defaultStyles,
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
        TIMEZONE_DISPLAY_FORMAT: localization?.timezoneDisplayFormat ?? 'none',
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eventBridgeCaptureResources: any[] = []

    if (cloudformationCaptures?.enabled !== false) {
      const resources = new Set<string>()

      if (cloudformationCaptures?.captureAll !== false) {
        resources.add('arn:aws:cloudformation:*:*:stack/*')
        eventBridgeCaptureResources.push({
          prefix: 'arn:aws:cloudformation:',
        })
      } else if (cloudformationCaptures?.resourceArns) {
        for (const arn of cloudformationCaptures.resourceArns) {
          resources.add(arn)
          eventBridgeCaptureResources.push(arn)
        }

        resources.add(Stack.of(this).stackId)
        eventBridgeCaptureResources.push(Stack.of(this).stackId)
      }

      this.lambdaHandler.addToRolePolicy(
        new aws_iam.PolicyStatement({
          actions: [
            'cloudformation:DescribeStacks',
            'cloudformation:DescribeStackResources',
          ],
          resources: [...resources],
        })
      )
    }

    this.lambdaHandler.addToRolePolicy(
      new aws_iam.PolicyStatement({
        actions: [
          's3:PutObject',
          's3:PutObjectAcl',
          's3:PutObjectTagging',
          's3:ListBucket',
          's3:GetObjectTagging',
        ],
        resources: [
          this.hostingBucket.bucketArn,
          `${this.hostingBucket.bucketArn}/*`,
        ],
      })
    )

    const source = ['aws.cloudformation']

    if (codepipelineCaptures?.enabled !== false) {
      source.push('aws.codepipeline')
      if (codepipelineCaptures?.captureAll !== false) {
        eventBridgeCaptureResources.push({
          prefix: 'arn:aws:codepipeline:',
        })
      } else if (codepipelineCaptures?.resourceArns) {
        for (const arn of codepipelineCaptures.resourceArns) {
          eventBridgeCaptureResources.push(arn)
        }
      }
    }

    const eventRule = new aws_events.Rule(this, 'Rule', {
      eventPattern: {
        detailType: [
          'CloudFormation Stack Status Change',
          'CodePipeline Pipeline Execution State Change',
          'CodePipeline Stage Execution State Change',
        ],
        resources: eventBridgeCaptureResources,
        source: ['aws.cloudformation', 'aws.codepipeline'],
      },
    })

    const target = new aws_events_targets.LambdaFunction(this.lambdaHandler, {
      maxEventAge: Duration.minutes(5),
      retryAttempts: 3,
    })

    eventRule.addTarget(target)

    if (addPreviewWebapp !== false) {
      this.functionUrl = this.lambdaHandler.addFunctionUrl({
        authType: aws_lambda.FunctionUrlAuthType.NONE,
      })

      new CfnOutput(this, 'BadgeUrl', {
        value: this.functionUrl.url,
      })
    }

    new CfnOutput(this, 'BadgeBucket', {
      value: this.hostingBucket.bucketWebsiteUrl,
    })
  }
}
