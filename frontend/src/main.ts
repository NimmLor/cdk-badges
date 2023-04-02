// eslint-disable-next-line import/no-unassigned-import
import './app.css'
import App from './App.svelte'

const target = document.querySelector('#app')

if (target === null) {
  throw new Error('No target element found')
}

const main = new App({
  target,
})

export default main
