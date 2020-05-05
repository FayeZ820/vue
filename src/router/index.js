import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

// import Users from '../components/users/Users.vue'
// import Rights from '../components/authorization/Rights.vue'
// import Roles from '../components/authorization/Roles.vue'
const Users = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/users/Users.vue')
const Rights = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/authorization/Rights.vue')
const Roles = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/authorization/Roles.vue')

// import Categories from '../components/goods/Categories.vue'
// import Params from '../components/goods/Params.vue'
const Categories = () => import(/* webpackChunkName: "categories_params" */ '../components/goods/Categories.vue')
const Params = () => import(/* webpackChunkName: "categories_params" */ '../components/goods/Params.vue')

// import Goods from '../components/goods/Goods.vue'
// import AddGoods from '../components/goods/addGoods.vue'
const Goods = () => import(/* webpackChunkName: "goods_addGoods" */ '../components/goods/Goods.vue')
const AddGoods = () => import(/* webpackChunkName: "goods_addGoods" */ '../components/goods/addGoods.vue')

// import Orders from '../components/orders/Orders.vue'
// import Reports from '../components/reports/Reports.vue'
const Orders = () => import(/* webpackChunkName: "orders_reports" */ '../components/orders/Orders.vue')
const Reports = () => import(/* webpackChunkName: "orders_reports" */ '../components/reports/Reports.vue')

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: AddGoods },
      { path: '/orders', component: Orders },
      { path: '/reports', component: Reports }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
