import strip from 'rollup-plugin-strip'
import uglify from 'rollup-plugin-uglify-es'
import devConfig from './dev.config'

const config = Object.assign({}, devConfig)
config.plugins = config.plugins.concat([
  strip(),
  uglify()
])

export default config
