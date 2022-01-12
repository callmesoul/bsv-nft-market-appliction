import * as path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import pkg from './package.json'
import styleImport from 'vite-plugin-style-import'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import { svgBuilder } from './svgBuilder'
import ElementPlus from 'unplugin-element-plus/vite'
import viteSvgIcons from 'vite-plugin-svg-icons'

export default ({ mode }) => {
  console.log('mode')
  console.log(mode)
  // 加载环境配置文件
  // const env = require('dotenv').config({ path: `./.env.${mode}` });
  const env = loadEnv(mode, process.cwd())
  return defineConfig({
    plugins: [
      vue(),
      // element-plus 按需加载
      ElementPlus(),
      // 多语言加载
      vueI18n({
        // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
        // compositionOnly: false,

        // you need to set i18n resource including paths !
        include: path.resolve(__dirname, './src/languages/**'),
      }),
      svgBuilder('./src/assets/svg/'),
      viteSvgIcons({
        // 配置路劲在你的src里的svg存放文件
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      _APP_VERSION: JSON.stringify(pkg.version),
    },
    server: {
      host: env.VITE_Hosts.replace(/https:\/\//, '').replace(/http:\/\//, ''),
      // host: '0.0.0.0',
      port: 443,
      https: true,
      open: false,
      // 本地调试， 需先把接口的baseurl 设置为 '', 然后target指向对应 ip
      // proxy: {
      //   '/api': {
      //     target: 'http://192.168.168.184:8012',
      //     changeOrigin: true,
      //   },
      // },
    },
    build: {
      target: 'es2015',
      minify: mode === 'prod' ? true : false,
      sourcemap: mode === 'prod' ? false : 'inline',
      rollupOptions: {
        output: {
          sourcemap: mode === 'prod' ? false : 'inline',
        },
      },
    },
    sourcemap: mode === 'prod' ? false : 'inline',
  })
}
