import {
  EslintConfig,
  GitConfig,
  PrettierConfig,
  VscodeConfig,
} from '@atws/projen-config'
import { awscdk } from 'projen'
import { NodePackageManager } from 'projen/lib/javascript'

// aws lambda function url support added in v2.21.0
// @see https://github.com/aws/aws-cdk/releases/tag/v2.21.0
const cdkVersion = '2.21.0'

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Lorenz Nimmervoll',
  authorAddress: 'admin@nimmervoll.work',
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
    'badge-maker',
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
  packageManager: NodePackageManager.YARN2,
  packageName: 'cdk-badges',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/NimmLor/cdk-badges.git',
  stability: 'experimental',
  workflowNodeVersion: '16.x',
})

project.setScript('cdk', 'cdk')
project.setScript(
  'e2e',
  'yarn build && yarn cdk deploy --app "./lib/integ.default.js" --require-approval never'
)

const buildLambdaTask = project.preCompileTask

buildLambdaTask.exec(
  'esbuild lambda/src/index.ts --bundle --outdir=lib/lambda --platform=node --external:@aws-sdk/* --minify --target=ES2022 --format=cjs'
)

project.tsconfigDev.addInclude('lambda/src/**/*.ts')

new PrettierConfig(project)

new EslintConfig(project, {
  ignorePaths: ['lib/**/*'],
  projenFileRegex: '{src,test,lambda}/**/*.ts',
})

new VscodeConfig(project, {
  vscodeExtensions: {
    addCdkExtensions: true,
    addCoreExtensions: true,
    addNodeExtensions: true,
  },
})

const ignorePatterns = ['.yarn/cache', '.yarn/install-state.gz']

new GitConfig(project)
project.gitignore.addPatterns(...ignorePatterns)
project.npmignore?.addPatterns(
  ...ignorePatterns,
  '.editorconfig',
  '.eslintignore',
  '.eslintrc',
  '.gitattributes',
  '.prettierrc.js',
  '.projenrc.ts',
  '.yarn',
  '.yarnrc.yml',
  'lambda',
  '!lib/lambda',
  '!lib',
  'dist',
  'logo.png',
  'ui.png',
  'yarn-error.log',
  'tsconfig.tsbuildinfo'
)

project.synth()
