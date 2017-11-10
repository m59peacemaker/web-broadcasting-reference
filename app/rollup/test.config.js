import Plugins from './plugins-shared'
import multiEntry from 'rollup-plugin-multi-entry'

export default {
  input: 'src/**/*.test.js',
  output: {
    format: 'iife',
    sourcemap: 'inline'
  },
  plugins: [
    multiEntry({ exports: false }),
    ...Plugins()
  ]
}
