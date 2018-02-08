import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import builtins from 'rollup-plugin-node-builtins'
import pkgInfo from './package.json'

export default [
  {
    input: 'index.js',
    output: [
      {
        file: pkgInfo.main,
        format: 'cjs'
      },
      {
        file: pkgInfo.module,
        format: 'es'
      },
      {
        file: pkgInfo.browser,
        format: 'umd',
        name: 'zd-swag-sdk'
      }
    ],
    external: ['bufferutil', 'utf-8-validate'],
    plugins: [
      resolve({
        preferBuiltins: true
      }),
      builtins(),
      json(),
      commonjs(),
      babel({
        exclude: ['node_modules/**']
      })
    ]
  }
]
