import { getTestStack } from './integ.default'
import type { StackProps, StageProps } from 'aws-cdk-lib'
import { App, aws_codebuild, pipelines, Stack, Stage } from 'aws-cdk-lib'
import type { Construct } from 'constructs'

export class TestStage extends Stage {
  public constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props)

    getTestStack(this)
  }
}

export class PipelineStack extends Stack {
  public constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props)

    const pipeline = new pipelines.CodePipeline(this, 'Pipeline', {
      codeBuildDefaults: {
        buildEnvironment: {
          // see https://docs.aws.amazon.com/codebuild/latest/userguide/available-runtimes.html
          buildImage: aws_codebuild.LinuxBuildImage.fromCodeBuildImageId(
            'aws/codebuild/standard:6.0'
          ),
        },
        partialBuildSpec: aws_codebuild.BuildSpec.fromObject({
          phases: { install: { 'runtime-versions': { nodejs: 16 } } },
        }),
      },
      pipelineName: 'cdk-badges-Pipeline',
      synth: new pipelines.ShellStep('Synth', {
        commands: ['yarn', 'yarn run e2e:synth'],
        input: pipelines.CodePipelineSource.connection(
          'NimmLor/cdk-badges',
          'codepipeline-support',
          {
            connectionArn:
              'arn:aws:codestar-connections:eu-central-1:961435721735:connection/430aee0e-89a8-4a88-b98f-cacbe9c7cc19',
          }
        ),
        primaryOutputDirectory: `cdk.out`,
      }),
    })

    pipeline.addStage(new TestStage(this, 'Test'))
  }
}

const app = new App()
new PipelineStack(app, 'cdk-badges-Pipeline', {})
