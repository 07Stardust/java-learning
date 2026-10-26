import DefaultTheme from 'vitepress/theme'
import StudyApp from './StudyApp.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('StudyApp', StudyApp)
  }
}
