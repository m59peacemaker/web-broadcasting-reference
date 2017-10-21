import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
//import closure from 'rollup-plugin-closure-compiler-js'
//import strip from 'rollup-plugin-strip'
import svelte from 'rollup-plugin-svelte'
//import buble from 'rollup-plugin-buble'
//import uglify from 'rollup-plugin-uglify-es'

const Plugins = () => [
  resolve({
    module: true, browser: true, jsnext: true, main: true, extensions: [ '.js', '.json' ]
  }),
  commonjs(),
  svelte()
  /*closure({
    languageIn: 'ECMASCRIPT6',
    languageOut: 'ECMASCRIPT5',
    compilationLevel: 'ADVANCED',
    warningLevel: 'VERBOSE',
    externs: [
      { src: `const global = window` }
    ]
  }),*/
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
