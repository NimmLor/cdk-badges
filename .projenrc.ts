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
    'aws-cdk',
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

const buildLambdaCommand =
  'esbuild lambda/src/index.ts --bundle --outdir=lib/lambda --platform=node --external":@aws-sdk/*" --minify --target=ES2022 --format=cjs'

project.setScript('cdk', 'cdk')
project.setScript(
  'e2e',
  'yarn build && yarn cdk deploy --app "./lib/integ.default.js" --require-approval never --outputs-file ./cdk.out/integ-outputs.json'
)

project.setScript(
  'e2e:synth',
  'yarn build && yarn cdk synth --app "./lib/integ.default.js"'
)

project.setScript(
  'deploy:lambda',
  `${buildLambdaCommand} && yarn cdk deploy --app "ts-node ./src/integ.default.ts" --require-approval never --hotswap --outputs-file ./cdk.out/integ-outputs.json`
)

project.setScript(
  'ci:synth',
  'yarn run build && yarn cdk synth --app "ts-node ./src/integ.pipeline.ts" --require-approval never'
)
project.setScript(
  'deploy:pipeline',
  'yarn cdk deploy --app "ts-node ./src/integ.pipeline.ts" --require-approval never'
)

const buildTask = project.preCompileTask

buildTask.exec(
  'cd frontend && yarn install && yarn build --emptyOutDir && cd ..'
)

buildTask.exec(buildLambdaCommand)

// locate the output url and write it to .env.local
buildTask.exec(
  `node -e "const fs=require('fs');try{fs.writeFileSync('./frontend/.env.local','VITE_API_URL='+Object.entries(JSON.parse(fs.readFileSync('cdk.out/integ-outputs.json')).Test).find(([k])=>k.includes('BadgeUrl'))[1])}catch{};"`
)

project.tsconfigDev.addInclude('lambda/src/**/*.ts')
project.tsconfigDev.addInclude('frontend/**/*.{ts,svelte}')

new PrettierConfig(project)

new EslintConfig(project, {
  ignorePaths: ['lib/**/*'],
  projenFileRegex: '{src,test,lambda}/**/*.ts',
})
  .getFiles()
  .eslintConfig.addOverride('overrides.1', {
    extends: ['@atws/eslint-config'],
    files: ['frontend/**/*.{ts,svelte}'],
    parserOptions: {
      project: 'frontend/tsconfig.json',
    },
  })

new VscodeConfig(project, {
  vscodeExtensions: {
    addCdkExtensions: true,
    addCoreExtensions: true,
    additionalExtensions: ['svelte.svelte-vscode'],
    addNodeExtensions: true,
  },
})

const ignorePatterns = [
  'cache',
  'install-state.gz',
  '!frontend/tsconfig.json',
  'frontend/dist',
  '.env.local',
]

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
  'frontend',
  '!lib/lambda',
  '!lib/lambda/frontend/index.html',
  '!lib',
  'dist',
  'logo.png',
  'ui.png',
  'yarn-error.log',
  'tsconfig.tsbuildinfo',
  'cdk.out'
)

project.synth()
