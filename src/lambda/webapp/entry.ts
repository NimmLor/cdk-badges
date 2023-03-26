const GITHUB_DARK_COLOR = '#0d1117'
const GITHUB_TEXT_COLOR = '#c9d1d9'
const GITHUB_LINK_COLOR = '#58a6ff'

export const render = (content: string) => {
  return `<html>
<head>
  <title>CDK Badges</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      background-color: ${GITHUB_DARK_COLOR};
      color: ${GITHUB_TEXT_COLOR};
    }
    .link, button {
      color: ${GITHUB_LINK_COLOR};
    }
    .link:hover, button:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
<div class="mx-4 my-8">
${content}
</div>
</body>
</html>
`
}
