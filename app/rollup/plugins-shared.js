import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
//import buble from 'rollup-plugin-buble'
import babel from 'rollup-plugin-babel'
import fs from 'fs'
const babelConfig = JSON.parse(fs.readFileSync(`${__dirname}/../.babelrc`))

export default () => [
  svelte({ cascade: false }),
  // TODO: use buble when #81 is fixed https://github.com/Rich-Harris/buble/issues/81
  //buble({ 'objectAssign': 'Object.assign' }),
  //babel(Object.assign({ babelrc: false }, babelConfig)),
  babel(),
  resolve({
    module: true, browser: true, jsnext: true, main: true, extensions: [ '.js', '.json' ]
  }),
  commonjs()
]
