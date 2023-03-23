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


## Structs <a name="Structs" id="Structs"></a>

### CdkBadgesProps <a name="CdkBadgesProps" id="cdk-badges.CdkBadgesProps"></a>

#### Initializer <a name="Initializer" id="cdk-badges.CdkBadgesProps.Initializer"></a>

```typescript
import { CdkBadgesProps } from 'cdk-badges'

const cdkBadgesProps: CdkBadgesProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#cdk-badges.CdkBadgesProps.property.additionalCfnStacks">additionalCfnStacks</a></code> | <code>string[]</code> | The arn of the stack that should be monitored for changes. |
| <code><a href="#cdk-badges.CdkBadgesProps.property.pipelines">pipelines</a></code> | <code><a href="#cdk-badges.PipelineProps">PipelineProps</a></code> | *No description.* |

---

##### `additionalCfnStacks`<sup>Optional</sup> <a name="additionalCfnStacks" id="cdk-badges.CdkBadgesProps.property.additionalCfnStacks"></a>

```typescript
public readonly additionalCfnStacks: string[];
```

- *Type:* string[]

The arn of the stack that should be monitored for changes.

---

##### `pipelines`<sup>Optional</sup> <a name="pipelines" id="cdk-badges.CdkBadgesProps.property.pipelines"></a>

```typescript
public readonly pipelines: PipelineProps;
```

- *Type:* <a href="#cdk-badges.PipelineProps">PipelineProps</a>

---

### PipelineProps <a name="PipelineProps" id="cdk-badges.PipelineProps"></a>

A map of pipelines consisting of an id and the pipeline itself.

The id is used to identify pipelines and their badges.

*Example*

```typescript
{
 'webapp': webappPipeline,
 'backend': backendPipeline,
}
```


#### Initializer <a name="Initializer" id="cdk-badges.PipelineProps.Initializer"></a>

```typescript
import { PipelineProps } from 'cdk-badges'

const pipelineProps: PipelineProps = { ... }
```




