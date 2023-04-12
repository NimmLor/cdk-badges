# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### CdkBadges <a name="CdkBadges" id="cdk-badges.CdkBadges"></a>

#### Initializers <a name="Initializers" id="cdk-badges.CdkBadges.Initializer"></a>

```typescript
import { CdkBadges } from 'cdk-badges'

new CdkBadges(scope: Stack, id: string, props: CdkBadgesProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-badges.CdkBadges.Initializer.parameter.scope">scope</a></code> | <code>aws-cdk-lib.Stack</code> | *No description.* |
| <code><a href="#cdk-badges.CdkBadges.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#cdk-badges.CdkBadges.Initializer.parameter.props">props</a></code> | <code><a href="#cdk-badges.CdkBadgesProps">CdkBadgesProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="cdk-badges.CdkBadges.Initializer.parameter.scope"></a>

- *Type:* aws-cdk-lib.Stack

---

##### `id`<sup>Required</sup> <a name="id" id="cdk-badges.CdkBadges.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="cdk-badges.CdkBadges.Initializer.parameter.props"></a>

- *Type:* <a href="#cdk-badges.CdkBadgesProps">CdkBadgesProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-badges.CdkBadges.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="cdk-badges.CdkBadges.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#cdk-badges.CdkBadges.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="cdk-badges.CdkBadges.isConstruct"></a>

```typescript
import { CdkBadges } from 'cdk-badges'

CdkBadges.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="cdk-badges.CdkBadges.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-badges.CdkBadges.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#cdk-badges.CdkBadges.property.hostingBucket">hostingBucket</a></code> | <code>aws-cdk-lib.aws_s3.Bucket</code> | *No description.* |
| <code><a href="#cdk-badges.CdkBadges.property.lambdaHandler">lambdaHandler</a></code> | <code>aws-cdk-lib.aws_lambda_nodejs.NodejsFunction</code> | *No description.* |
| <code><a href="#cdk-badges.CdkBadges.property.functionUrl">functionUrl</a></code> | <code>aws-cdk-lib.aws_lambda.FunctionUrl</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="cdk-badges.CdkBadges.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `hostingBucket`<sup>Required</sup> <a name="hostingBucket" id="cdk-badges.CdkBadges.property.hostingBucket"></a>

```typescript
public readonly hostingBucket: Bucket;
```

- *Type:* aws-cdk-lib.aws_s3.Bucket

---

##### `lambdaHandler`<sup>Required</sup> <a name="lambdaHandler" id="cdk-badges.CdkBadges.property.lambdaHandler"></a>

```typescript
public readonly lambdaHandler: NodejsFunction;
```

- *Type:* aws-cdk-lib.aws_lambda_nodejs.NodejsFunction

---

##### `functionUrl`<sup>Optional</sup> <a name="functionUrl" id="cdk-badges.CdkBadges.property.functionUrl"></a>

```typescript
public readonly functionUrl: FunctionUrl;
```

- *Type:* aws-cdk-lib.aws_lambda.FunctionUrl

---


## Structs <a name="Structs" id="Structs"></a>

### CaptureSettings <a name="CaptureSettings" id="cdk-badges.CaptureSettings"></a>

#### Initializer <a name="Initializer" id="cdk-badges.CaptureSettings.Initializer"></a>

```typescript
import { CaptureSettings } from 'cdk-badges'

const captureSettings: CaptureSettings = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-badges.CaptureSettings.property.captureAll">captureAll</a></code> | <code>boolean</code> | Whether to capture all pipelines in the account. |
| <code><a href="#cdk-badges.CaptureSettings.property.enabled">enabled</a></code> | <code>boolean</code> | Enable the codepipeline capture. |
| <code><a href="#cdk-badges.CaptureSettings.property.resourceArns">resourceArns</a></code> | <code>string[]</code> | The name of the pipeline that should be monitored for changes. |

---

##### `captureAll`<sup>Optional</sup> <a name="captureAll" id="cdk-badges.CaptureSettings.property.captureAll"></a>

```typescript
public readonly captureAll: boolean;
```

- *Type:* boolean
- *Default:* true

Whether to capture all pipelines in the account.

---

##### `enabled`<sup>Optional</sup> <a name="enabled" id="cdk-badges.CaptureSettings.property.enabled"></a>

```typescript
public readonly enabled: boolean;
```

- *Type:* boolean
- *Default:* true

Enable the codepipeline capture.

---

##### `resourceArns`<sup>Optional</sup> <a name="resourceArns" id="cdk-badges.CaptureSettings.property.resourceArns"></a>

```typescript
public readonly resourceArns: string[];
```

- *Type:* string[]

The name of the pipeline that should be monitored for changes.

Must be set if captureAll is false.

---

### CdkBadgesProps <a name="CdkBadgesProps" id="cdk-badges.CdkBadgesProps"></a>

#### Initializer <a name="Initializer" id="cdk-badges.CdkBadgesProps.Initializer"></a>

```typescript
import { CdkBadgesProps } from 'cdk-badges'

const cdkBadgesProps: CdkBadgesProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-badges.CdkBadgesProps.property.addPreviewWebapp">addPreviewWebapp</a></code> | <code>boolean</code> | Whether to add a preview webapp to the stack. |
| <code><a href="#cdk-badges.CdkBadgesProps.property.badgeStyles">badgeStyles</a></code> | <code>string[]</code> | The style of the badge to generate. |
| <code><a href="#cdk-badges.CdkBadgesProps.property.cacheControl">cacheControl</a></code> | <code>string</code> | The cache control header to use when writing badges to S3. |
| <code><a href="#cdk-badges.CdkBadgesProps.property.cloudformationCaptures">cloudformationCaptures</a></code> | <code><a href="#cdk-badges.CaptureSettings">CaptureSettings</a></code> | The settings for creating cloudformation badges. |
| <code><a href="#cdk-badges.CdkBadgesProps.property.codepipelineCaptures">codepipelineCaptures</a></code> | <code><a href="#cdk-badges.CaptureSettings">CaptureSettings</a></code> | The settings for creating codepipeline badges. |
| <code><a href="#cdk-badges.CdkBadgesProps.property.localization">localization</a></code> | <code><a href="#cdk-badges.LocalizationSettings">LocalizationSettings</a></code> | The formatting of the timestamps used in the badges. |

---

##### `addPreviewWebapp`<sup>Optional</sup> <a name="addPreviewWebapp" id="cdk-badges.CdkBadgesProps.property.addPreviewWebapp"></a>

```typescript
public readonly addPreviewWebapp: boolean;
```

- *Type:* boolean
- *Default:* true

Whether to add a preview webapp to the stack.

---

##### `badgeStyles`<sup>Optional</sup> <a name="badgeStyles" id="cdk-badges.CdkBadgesProps.property.badgeStyles"></a>

```typescript
public readonly badgeStyles: string[];
```

- *Type:* string[]
- *Default:* ['flat-square', 'flat', 'for-the-badge', 'plastic']

The style of the badge to generate.

---

##### `cacheControl`<sup>Optional</sup> <a name="cacheControl" id="cdk-badges.CdkBadgesProps.property.cacheControl"></a>

```typescript
public readonly cacheControl: string;
```

- *Type:* string
- *Default:* 'max-age=300, private'

The cache control header to use when writing badges to S3.

---

##### `cloudformationCaptures`<sup>Optional</sup> <a name="cloudformationCaptures" id="cdk-badges.CdkBadgesProps.property.cloudformationCaptures"></a>

```typescript
public readonly cloudformationCaptures: CaptureSettings;
```

- *Type:* <a href="#cdk-badges.CaptureSettings">CaptureSettings</a>

The settings for creating cloudformation badges.

---

##### `codepipelineCaptures`<sup>Optional</sup> <a name="codepipelineCaptures" id="cdk-badges.CdkBadgesProps.property.codepipelineCaptures"></a>

```typescript
public readonly codepipelineCaptures: CaptureSettings;
```

- *Type:* <a href="#cdk-badges.CaptureSettings">CaptureSettings</a>
- *Default:* captureAll: true

The settings for creating codepipeline badges.

---

##### `localization`<sup>Optional</sup> <a name="localization" id="cdk-badges.CdkBadgesProps.property.localization"></a>

```typescript
public readonly localization: LocalizationSettings;
```

- *Type:* <a href="#cdk-badges.LocalizationSettings">LocalizationSettings</a>

The formatting of the timestamps used in the badges.

---

### LocalizationSettings <a name="LocalizationSettings" id="cdk-badges.LocalizationSettings"></a>

#### Initializer <a name="Initializer" id="cdk-badges.LocalizationSettings.Initializer"></a>

```typescript
import { LocalizationSettings } from 'cdk-badges'

const localizationSettings: LocalizationSettings = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-badges.LocalizationSettings.property.hour12">hour12</a></code> | <code>boolean</code> | Whether to use 12 hour time format. |
| <code><a href="#cdk-badges.LocalizationSettings.property.locale">locale</a></code> | <code>string</code> | The locale to use when generating badges. |
| <code><a href="#cdk-badges.LocalizationSettings.property.showSeconds">showSeconds</a></code> | <code>boolean</code> | Wheter to show seconds in the time. |
| <code><a href="#cdk-badges.LocalizationSettings.property.timezone">timezone</a></code> | <code>string</code> | The timezone to use when generating badges. |
| <code><a href="#cdk-badges.LocalizationSettings.property.timezoneDisplayFormat">timezoneDisplayFormat</a></code> | <code>string</code> | The format of the timezone to display. |

---

##### `hour12`<sup>Optional</sup> <a name="hour12" id="cdk-badges.LocalizationSettings.property.hour12"></a>

```typescript
public readonly hour12: boolean;
```

- *Type:* boolean
- *Default:* false

Whether to use 12 hour time format.

---

##### `locale`<sup>Optional</sup> <a name="locale" id="cdk-badges.LocalizationSettings.property.locale"></a>

```typescript
public readonly locale: string;
```

- *Type:* string
- *Default:* 'en-GB'

The locale to use when generating badges.

---

*Example*

```typescript
'de-AT'
```


##### `showSeconds`<sup>Optional</sup> <a name="showSeconds" id="cdk-badges.LocalizationSettings.property.showSeconds"></a>

```typescript
public readonly showSeconds: boolean;
```

- *Type:* boolean
- *Default:* false

Wheter to show seconds in the time.

---

##### `timezone`<sup>Optional</sup> <a name="timezone" id="cdk-badges.LocalizationSettings.property.timezone"></a>

```typescript
public readonly timezone: string;
```

- *Type:* string
- *Default:* 'UTC'

The timezone to use when generating badges.

---

*Example*

```typescript
'Europe/Vienna'
```


##### `timezoneDisplayFormat`<sup>Optional</sup> <a name="timezoneDisplayFormat" id="cdk-badges.LocalizationSettings.property.timezoneDisplayFormat"></a>

```typescript
public readonly timezoneDisplayFormat: string;
```

- *Type:* string
- *Default:* 'none'

The format of the timezone to display.

Sets the timeZoneName option of the Intl.DateTimeFormat constructor.

> [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#parameters)

---



