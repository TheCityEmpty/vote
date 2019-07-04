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
        path: '/activity',
        name: 'activity',
        component: () => import(/* webpackChunkName: "activity" */'@/view/activity/activity')
      },
      {
        path: '/release',
        name: 'release',
        component: () => import(/* webpackChunkName: "release" */'@/view/activity/release')
      },
      // {
      //   path: '/activitySignUp',
      //   name: 'activitySignUp',
      //   component: () => import(/* webpackChunkName: "activitySignUp" */'@/view/activity/signUp')
      // },
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
