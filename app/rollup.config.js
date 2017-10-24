import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
//import strip from 'rollup-plugin-strip'
//import buble from 'rollup-plugin-buble'
//import uglify from 'rollup-plugin-uglify-es'

const Plugins = () => [
  svelte(),
  resolve({
    module: true, browser: true, jsnext: true, main: true, extensions: [ '.js', '.json' ]
  }),
  commonjs(),
  //strip(),
  //buble()
  //uglify()
]

export default [
  {
    input: 'src/app.js',
    output: {
      file: 'www/static/build/app.js',
      format: 'iife'
    },
    plugins: Plugins()
  }
]
