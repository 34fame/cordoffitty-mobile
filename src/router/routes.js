const routes = [
   {
      path: '/',
      component: () => import('layouts/PublicLayout.vue'),
      children: [
         {
            name: 'index',
            path: '',
            component: () => import('pages/Index.vue'),
         },
         {
            name: 'index-tenant',
            path: ':tenantId',
            component: () => import('pages/Index.vue'),
         },
      ],
   },
   {
      path: '/a',
      component: () => import('layouts/AuthLayout.vue'),
      children: [
         {
            name: 'login',
            path: 'login',
            component: () => import('pages/Login.vue'),
         },
         {
            name: 'login-tenant',
            path: 'login/:tenantId',
            component: () => import('pages/Login.vue'),
         },
         {
            name: 'logout',
            path: 'logout',
            component: () => import('pages/Logout.vue'),
         },
      ],
   },
   {
      path: '/o',
      component: () => import('layouts/OperatorLayout.vue'),
      children: [
         {
            name: 'operator',
            path: 'operator',
            component: () => import('pages/Operator.vue'),
         },
         {
            name: 'debugger',
            path: 'debugger',
            component: () => import('pages/Debugger.vue'),
         },
      ],
   },
   {
      path: '/s',
      component: () => import('layouts/MainLayout.vue'),
      children: [
         {
            name: 'home',
            path: 'home',
            component: () => import('pages/Home.vue'),
         },
      ],
   },

   {
      path: '/:catchAll(.*)*',
      component: () => import('pages/Error404.vue'),
   },
]

export default routes
