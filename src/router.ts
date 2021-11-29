import { createRouter, createWebHistory, RouterView } from 'vue-router'
const Home = () => import('@/views/Home.vue')
const Create = () => import('@/views/Create.vue')
const NftSuccess = () => import('@/views/NftSuccess.vue')
const Detail = () => import('@/views/Detail.vue')
const Sale = () => import('@/views/sale/Sale.vue')
const SaleLegend = () => import('@/views/sale/Legend.vue')
const Login = () => import('@/views/Login.vue')
const Self = () => import('@/views/Self.vue')
const User = () => import('@/views/User.vue')
const Series = () => import('@/views/Series.vue')
const MetaBot = () => import('@/views/MetaBot.vue')
const Recommend = () => import('@/views/Recommend.vue')
const TariffDescription = () => import('@/views/app/TariffDescription.vue')
const CertSystemIntro = () => import('@/views/app/CertSystemIntro.vue')
const TermsOfUse = () => import('@/views/app/TermsOfUse.vue')
const TopicIndex = () => import('@/views/topic/Index.vue')
const TopicDetail = () => import('@/views/topic/Detail.vue')
const CommonLayout = () => import('@/layouts/CommonLayout.vue')
const CountryFair = () => import('@/views/CountryFair.vue')
const BatchCreate = () => import('@/views/batch/Create.vue')
const BatchSale = () => import('@/views/batch/Sale.vue')
const BatchTest = () => import('@/views/BatchTest.vue')
const Right = () => import('@/views/Right.vue')
import { useStore, Action, Mutation } from '@/store/index'
import { ElMessage } from 'element-plus'
import i18n from '@/utils/i18n'
import { Langs } from './api'
import { checkUserCanIssueNft } from './utils/util'
const store = useStore()
let removeRoute: (() => void) | undefined
console.log('import.meta.env.PROD', import.meta.env.PROD)
export const routerHistory = createWebHistory()
export const router = createRouter({
  history: routerHistory,
  strict: true,
  routes: [
    { path: '/', name: 'home', component: Home, meta: { keepAlive: true } },
    { path: '/create', name: 'create', component: Create, meta: { isAuth: true } },
    {
      path: '/nftSuccess/:genesisId/:codehash/:tokenIndex',
      name: 'nftSuccess',
      component: NftSuccess,
      meta: { isAuth: true },
    },
    { path: '/detail/:genesisId/:codehash/:tokenIndex', name: 'detail', component: Detail },
    {
      path: '/sale/:genesisId/:codehash/:tokenIndex',
      name: 'sale',
      component: Sale,
      meta: { isAuth: true },
    },
    { path: '/saleLegend', name: 'saleLegend', component: SaleLegend },
    { path: '/self', name: 'self', component: Self, meta: { isAuth: true } },
    { path: '/series/:genesisId/:codehash', name: 'series', component: Series },
    { path: '/login', name: 'login', component: Login },
    { path: '/recommned', name: 'recommned', component: Recommend },
    { path: '/fees', name: 'fees', component: TariffDescription },
    { path: '/termsOfUse', name: 'termsOfUse', component: TermsOfUse },
    { path: '/certification', name: 'certification', component: CertSystemIntro },
    { path: '/metaBot', name: 'metaBot', component: MetaBot },
    { path: '/user/:metaId', name: 'user', component: User },
    { path: '/market', name: 'market', component: CountryFair },
    {
      path: '/collection',
      name: 'topic',
      component: CommonLayout,
      redirect: '/collection/index',
      children: [
        { path: 'index', name: 'topicIndex', component: TopicIndex },
        { path: 'detail/:key', name: 'topicDetail', component: TopicDetail },
      ],
    },
    {
      path: '/batch',
      name: 'batch',
      component: CommonLayout,
      children: [
        {
          path: 'create',
          name: 'batchCreate',
          component: BatchCreate,
          meta: { keepAlive: true, isAuth: true },
        },
        {
          path: 'sale',
          name: 'batchSale',
          component: BatchSale,
          meta: { keepAlive: true, isAuth: true },
        },
        {
          path: 'test',
          name: 'batchTest',
          component: BatchTest,
          meta: { keepAlive: true, isAuth: true },
        },
      ],
    },
    { path: '/right', name: 'right', component: Right },
  ],
  async scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      // TODO: check if parent in common that works with alias
      if (to.matched.every((record, i) => from.matched[i] !== record)) return { left: 0, top: 0 }
    }
    // leave scroll as it is by not returning anything
    // https://github.com/Microsoft/TypeScript/issues/18319
    return false
  },
})

// const delay = (t: number) => new Promise(resolve => setTimeout(resolve, t))

// remove trailing slashes
// router.beforeEach((to, from, next) => {
//   if (/.\/$/.test(to.path)) {
//     to.meta.redirectCode = 301
//     next(to.path.replace(/\/$/, ''))
//   } else next()
//   // next()
// })

// router.beforeEach(async (to, from, next) => {
//   // console.log(`Guard from ${from.fullPath} to ${to.fullPath}`)
//   if (to.params.id === 'no-name') return next(false)

//   const time = Number(to.query.delay)
//   if (time > 0) {
//     console.log('⏳ waiting ' + time + 'ms')
//     to.meta.waitedFor = time
//     await delay(time)
//   }
//   next()
// })

router.beforeEach(async (to, from, next) => {
  // 获取系统配置信息
  if (!store.state.isSetedSystemConfig) {
    await store.dispatch(Action.setSystemConfig)
  }

  // app
  const isApp = store.state.isApp
  if (isApp) {
    //  没有用户信息， 也没有正在加载用户信息, 则去获取用户信息
    if (!store.state.userInfo && !store.state.userInfoLoading) {
      store.dispatch(Action.getUserInfo)
    }
  } else {
    // web
    const token = store.state.token
    if (token) {
      const now = new Date().getTime()
      // token 过期先刷新token, 没过期直接用
      if (now >= token.expires_time!) {
        await store.dispatch(Action.refreshToken)
      }
      // 有token 没有初始化sdk 就去初始化sdk
      if (!store.state.sdk && !store.state.sdkInitIng) {
        store.dispatch(Action.initSdk)
      }

      if (to.name === 'create' && store.state.userInfo) {
        const result = await checkUserCanIssueNft()
        if (!result) return
      }
    } else {
      // 没有token
      const isAuth = to.meta && to.meta.isAuth ? to.meta.isAuth : false
      if (isAuth) {
        // 需要权限的提示先登陆且不给予跳转
        ElMessage.error(i18n.global.t('toLoginTip'))
        return
      }
    }
  }
  next()
})

// router.afterEach((to, from) => {
//   if (to.name === from.name && to.name === 'repeat') {
//     const toDepth = to.path.split('/').length
//     const fromDepth = from.path.split('/').length
//     to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
//   }
// })

// router.afterEach((to, from) => {
//   // console.log(
//   //   `After guard: from ${from.fullPath} to ${
//   //     to.fullPath
//   //   } | location = ${location.href.replace(location.origin, '')}`
//   // )
// })

export function go(delta: number) {
  return new Promise((resolve, reject) => {
    function popStateListener() {
      clearTimeout(timeout)
    }
    window.addEventListener('popstate', popStateListener)

    function clearHooks() {
      removeAfterEach()
      removeOnError()
      window.removeEventListener('popstate', popStateListener)
    }

    // if the popstate event is not called, consider this a failure
    const timeout = setTimeout(() => {
      clearHooks()
      reject(new Error('Failed to use router.go()'))
      // using 0 leads to false positives
    }, 1)

    // setImmediate

    const removeAfterEach = router.afterEach((_to, _from, failure) => {
      clearHooks()
      resolve(failure)
    })
    const removeOnError = router.onError(err => {
      clearHooks()
      reject(err)
    })

    router.go(delta)
  })
}

// @ts-expect-error
window._go = go

router.beforeEach((to, from, next) => {
  // console.log('second guard')
  if (to.query.to) next(to.query.to as string)
  else next()
})

const dirLog = {
  '': '？',
  back: '⏪',
  forward: '⏩',
}
routerHistory.listen((to, from, info) => {
  console.log(`${dirLog[info.direction]} as a ${info.type}`)
})
