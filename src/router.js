import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('./views/Login.vue')
const Register = () => import('./views/Register.vue')

const Home = () => import('./views/Home.vue')
const Index = () => import('./views/Index.vue')
const Detail = () => import('./views/Detail.vue')

const Cart = () => import('./views/Cart.vue')

const Trade = () => import('./views/Trade.vue')

const Pay = () => import('./views/Pay.vue')
const Alipay = () => import('./views/Alipay.vue')

const User = () => import('./views/User.vue')
const Profile = () => import('./views/Profile.vue')
const Address = () => import('./views/Address.vue')
const Orders = () => import('./views/Orders.vue')
const Order = () => import('./views/Order.vue')

const Search = () => import('./views/Search.vue')

Vue.use(Router)

const routes = [
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/index',
      children: [{
        path: '/index',
        name: 'index',
        component: Index
      },
      {
        path: '/search',
        name: 'search',
        component: Search
      },
      {
        path: '/detail/:id',
        name: 'detail',
        component: Detail,
      },
      {
        path: '/cart',
        name: 'cart',
        component: Cart
      },
      {
        path: '/trade',
        name: 'trade',
        component: Trade
      },
      {
        path: '/pay',
        name: 'pay',
        component: Pay
      },
      {
        path: '/user',
        name: 'user',
        component: User,
        redirect: '/profile',
        children:[{
          path: '/profile',
          name: 'profile',
          component: Profile
        },
        {
          path: '/address',
          name: 'address',
          component: Address
        },
        {
          path: '/orders',
          name: 'orders',
          component: Orders
        },
        {
          path: '/orders/:orderNo',
          name: 'order',
          component: Order
        }
      ]
      },
    ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/alipay',
      name: 'alipay',
      component: Alipay
    },
  ]

  const router = new Router({
    routes
  })

// 跳转到同一页面时https://blog.csdn.net/qq_36437172/article/details/108269846
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

router.beforeEach((to, from, next) => {
  //to：将要访问的路径
  //from：从哪个路径跳转而来
  //next：是一个函数，表示放行
  if (to.path === '/login'||to.path === '/register'||to.path === '/index'||to.path === '/search'||to.name==='detail') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next({ name: 'login' })//强制跳转
  next()//放行
})

export default router