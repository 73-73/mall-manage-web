import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

function route (path, file, name, children) {
  return {
    exact: true,
    path,
    name,
    children,
    component: () => import('../pages' + file)
  }
}

export default new Router({
  routes: [
    {
      path:"/login",
      name: "Login",
      component: () => import('../pages' + '/Login'),
      meta:{
        layout:"App",
        title:"微商城登录"

      }
    },
    {
      path:"/", // 根路径，路由到 Layout组件
      component: () => import('../pages/Layout'),
      redirect:"/login",
      children:[ // 其它所有组件都是 Layout的子组件
        route("/item/category",'/item/Category',"Category"),
        route("/item/brand",'/item/Brand',"Brand"),
        route("/item/list",'/item/Goods',"Goods"),
        route("/item/specification",'/item/specification/Specification',"Specification"),
        route("/user/list",'/user/list',"userList"),//会员管理
        route("/trade/order",'/trade/order',"orderList"),//订单管理
      ],
      meta: {
        auth: true
      }
    }
  ]
})
