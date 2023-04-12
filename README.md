[![cdk-badges](logo.png)](https://github.com/NimmLor/cdk-badges)

[![npm version](https://badge.fury.io/js/cdk-badges.svg?style=flat-square)](https://npmjs.com/package/cdk-badges)
![Pipeline](https://github.com/NimmLor/cdk-badges/actions/workflows/release.yml/badge.svg?style=flat-square)

![](https://test-badgeshostingbuckete4222a39-u0yatb0qkvhg.s3.eu-central-1.amazonaws.com/cf/Test/status-detailed.svg) ![](https://test-badgeshostingbuckete4222a39-u0yatb0qkvhg.s3.eu-central-1.amazonaws.com/cf/Test/resource-count.svg)

Generate badges for your cdk applications. Badges are created via eventbride events that invoke a lambda function that writes the badge to a s3 bucket.

## Installation

```bash
yarn add cdk-badges
```

## Usage

Generate Badges for your cloudformation stacks.

```ts
new CdkBadges(stack, 'Badges', {
  cloudformationCaptures: {
    captureAll: true,
    enabled: true,
  },
  codepipelineCaptures: {
    captureAll: true,
    enabled: true,
  },
  badgeStyles: ['flat-square'],
  cacheControl: 'max-age=300',
  localization: {
    hour12: false,
    locale: 'de-AT',
    showSeconds: false,
    timezone: 'Europe/Vienna',
  },
})
```

## Features

- [x] Generate badges for your stacks
- [x] View all available badges in a web ui
- [x] Generate badges for aws codepipeline

### Available Badges

- Cloudformation stack status
- Cloudformation resource count

### Web UI

The web ui shows all available badges in the specified s3 bucket. It can be accessed via the cloudformation output.

[![web-ui](ui.png)](https://github.com/NimmLor/cdk-badges)

### Adding a custom domain

To add a custom domain for badges you should use a cloudfront distribution.
Create a cloudfront distribution with the s3 bucket as origin and add a custom domain. Specify the root object to use the lambda function url as an origin.
