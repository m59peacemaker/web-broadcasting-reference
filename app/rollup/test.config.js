import Plugins from './plugins-shared'
import multiEntry from 'rollup-plugin-multi-entry'
import nodeBuiltins from 'rollup-plugin-node-builtins'
import nodeGlobals from 'rollup-plugin-node-globals'

export default {
  input: [
    'node_modules/source-map-support/register.js',
    'src/**/*.test.js'
  ],
  output: {
    format: 'iife',
    sourcemap: 'inline'
  },
  plugins: [
    multiEntry({ exports: false }),
    ...Plugins(),
    nodeBuiltins({ preferBuiltins: false }),
    nodeGlobals()
  ]
}
