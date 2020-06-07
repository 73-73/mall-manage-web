// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import config from './config'
import MyComponent from './components/MyComponent'
import './http';
import 'vuetify/dist/vuetify.min.css'
import qs from 'qs'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/material.css'

Vue.use(Vuetify, {theme: config.theme})
Vue.use(MyComponent)
Vue.prototype.$qs = qs;

Vue.config.productionTip = false


/* eslint-disable no-new */
const thisApp = new Vue({
  el: '#app',
  data: {
    username: '',
    permission: 4
  },
  //定义这个是因为第一次直接访问url路径会导致不经过路径转发的钩子函数，无法验证是否登录,但是效果不好
  // created: function () {
  //   this.$router.push("/login");
  //   console.log("123")
  // },
  router,
  components: {App},
  template: '<App/>'
})

//在每次路由跳转时判定是否登录
router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.auth)) {
    Vue.prototype.$http.get("/auth/verify").then(() => {
      // thisApp.data.username = res.response.data.username;
      // thisApp.data.permission = res.data.permission;
      next();
    }).catch(
      () => {
        thisApp.$message.warning('检测到您还未登录,请登录后操作！');
        next("/login");
      }
    )
  } else {
    next();
  }
})
