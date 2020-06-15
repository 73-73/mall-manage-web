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
import userInfo from "./userInfo";

Vue.use(Vuetify, {theme: config.theme});
Vue.use(MyComponent);
Vue.prototype.$qs = qs;

Vue.config.productionTip = false;


/* eslint-disable no-new */
const thisApp = new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
});

//在每次路由跳转时判定是否登录
router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.auth)) {
    Vue.prototype.$http.get("/auth/verify").then((res) => {
      // thisApp.data.username = res.response.data.username;
      // thisApp.data.permission = res.data.permission;
      // console.log(res.data.username);
      userInfo.username = res.data.username;
      userInfo.permission = res.data.permission;
      // console.log(thisApp.username);
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
});

export default thisApp;
