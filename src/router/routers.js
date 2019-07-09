import index from '@/view/index.vue'

export default [
  {
    path: '/',
    // redirect: to => {
    //   const flag = String(store.state.code || cookies.get('roleId'))
    //   if (flag === '5') {
    //     return '/feedBackPage'
    //   } else {
    //     return '/myStaying'
    //   }
    // },
    redirect: '/activity',
    component: index,
    children: [
      {
        path: '/chart',
        name: 'chart',
        component: () => import(/* webpackChunkName: "chart" */'@/view/chart')
      },
      {
        path: '/activity',
        name: 'activity',
        component: () => import(/* webpackChunkName: "activity" */'@/view/activity/activity')
      },
      {
        path: '/release',
        name: 'release',
        component: () => import(/* webpackChunkName: "release" */'@/view/activity/release')
      },
      {
        path: '/activeVote',
        name: 'activeVote',
        component: () => import(/* webpackChunkName: "activeVote" */'@/view/activity/activeVote')
      },
      {
        path: '/activeSignUp',
        name: 'activeSignUp',
        component: () => import(/* webpackChunkName: "activeSignUp" */'@/view/activity/activeSignUp')
      },
      {
        path: '/signUp',
        name: 'signUp',
        component: () => import(/* webpackChunkName: "signUp" */'@/view/signUp/signUp')
      },
      {
        path: '/addSignUp',
        name: 'addSignUp',
        component: () => import(/* webpackChunkName: "addSignUp" */'@/view/signUp/addSignUp')
      },
      {
        path: '/vote',
        name: 'vote',
        component: () => import(/* webpackChunkName: "vote" */'@/view/vote/vote')
      },
      {
        path: '/pay',
        name: 'pay',
        component: () => import(/* webpackChunkName: "pay" */'@/view/pay/pay')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */'@/view/login/login')
  }
]
