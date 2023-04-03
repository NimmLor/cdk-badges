export type Badge = {
  key: string
  tags: {
    [key: string]: string
    generatedAt: string
    label: string
    source: 'cdk-badges'
    style: string
  }
  updatedAt: string
  url: string
}
