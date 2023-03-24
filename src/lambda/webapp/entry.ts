export const render = (content: string) => {
  return `<html>
<head>
  <title>CDK Badges</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
<div class="max-w-4xl mx-4 my-8">
${content}
</div>
</body>
</html>
`
}
