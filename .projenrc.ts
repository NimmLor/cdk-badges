import {
  EslintConfig,
  GitConfig,
  PrettierConfig,
  VscodeConfig,
} from '@atws/projen-config'
import { awscdk } from 'projen'

// aws lambda function url support added in v2.21.0
// @see https://github.com/aws/aws-cdk/releases/tag/v2.21.0
// node16 support added in v2.24.0
// @see https://github.com/aws/aws-cdk/releases/tag/v2.24.0
// node18 support added in v2.51.0
// @see https://github.com/aws/aws-cdk/releases/tag/v2.51.0
const cdkVersion = '2.24.0'

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Lorenz Nimmervoll',
  authorAddress: 'admin@nimmervoll.work',
  bundledDeps: ['badge-maker'],
  cdkVersion,
  defaultReleaseBranch: 'main',
  deps: [],
  description: 'Get awesome status badges for your cdk projects.',
  devDeps: [
    'aws-sdk@2.1083.0',
    'esbuild',
    '@atws/projen-config',
    '@atws/tsconfig',
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
new PrettierConfig(project)

new EslintConfig(project, {
  projenFileRegex: '{src,test}/*.ts',
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
