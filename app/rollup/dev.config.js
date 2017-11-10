import Plugins from './plugins-shared'

export default {
  input: 'src/app.js',
  output: {
    file: 'www/static/build/app.js',
    format: 'iife'
  },
  plugins: Plugins()
}
