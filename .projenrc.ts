import {
  EslintConfig,
  GitConfig,
  PrettierConfig,
  VscodeConfig,
} from '@atws/projen-config'
import { awscdk } from 'projen'

// aws lambda function url support added in v2.21.0
// @see https://github.com/aws/aws-cdk/releases/tag/v2.21.0
const cdkVersion = '2.21.0'

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Lorenz Nimmervoll',
  authorAddress: 'admin@nimmervoll.work',
  bundledDeps: ['badge-maker'],
  cdkVersion,
  defaultReleaseBranch: 'main',
  deps: [],
  description: 'Get awesome status badges for your cdk projects.',
  devDeps: [
    'esbuild',
    '@atws/projen-config',
    '@atws/tsconfig',
    '@aws-sdk/client-cloudformation@3.188.0',
    '@aws-sdk/client-s3@3.188.0',
    '@types/aws-lambda',
    'lambda-api',
  ],
  gitignore: ['cdk.out', 'tsconfig.json'],
  jest: true,
  jestOptions: {
    extraCliOptions: [
      '--testMatch "**/(test|src)/**/*(*.)@(spec|test).ts?(x)"',
    ],
  },
  keywords: ['cdk', 'awscdk', 'aws-cdk'],

  majorVersion: 0,
  name: 'cdk-badges',
  packageName: 'cdk-badges',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/NimmLor/cdk-badges.git',
  stability: 'experimental',
  workflowNodeVersion: '16.x',
})

project.setScript('cdk', 'cdk')
project.setScript(
  'e2e',
  'yarn build && yarn cdk deploy --app "./lib/integ.default.js" --profile sandbox-h --require-approval never'
)
project.setScript(
  'deploy',
  'yarn cdk deploy --app "npx ts-node --prefer-ts-exts ./src/integ.default.ts" --profile sandbox-h --require-approval never --hotswap'
)

new PrettierConfig(project)

new EslintConfig(project, {
  ignorePaths: ['lib/**/*'],
  projenFileRegex: '{src,test}/**/*.ts',
})

new VscodeConfig(project, {
  vscodeExtensions: {
    addCdkExtensions: true,
    addCoreExtensions: true,
    addNodeExtensions: true,
  },
})

new GitConfig(project)

project.synth()
