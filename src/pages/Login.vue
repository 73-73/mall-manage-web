<template>
  <div>
  <div class="background">
<!--    <img src="../assets/background.jpg" width="100%" height="100%" alt="" />-->
    <v-app>
      <v-content>
        <v-container fluid fill-height>
          <v-layout align-center justify-center>
            <v-flex xs12 sm8 md4>
              <v-card class="elevation-12">
                <v-toolbar dark>
                  <v-toolbar-title>商城后台管理系统</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-form>
                    <v-text-field prepend-icon="person" v-model="username" label="用户名" type="text"/>
                    <v-text-field
                      prepend-icon="lock"
                      v-model="password"
                      label="密码"
                      id="password"
                      :append-icon="e1 ? 'visibility' : 'visibility_off'"
                      :append-icon-cb="() => (e1 = !e1)"
                      :type="e1 ? 'text' : 'password'"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn dark @click="doLogin">登录</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </v-content>
      <v-dialog v-model="dialog" width="300px">
        <v-alert icon="warning" color="error" :value="true">
          用户名和密码不能为空
        </v-alert>
      </v-dialog>
    </v-app>
</template>

<script>
export default {
  data: () => ({
    username: "",
    password: "",
    dialog: false,
    e1:false
  }),
  methods: {
    doLogin() {
      if (!this.username || !this.password) {
        this.dialog = true;
        return false;
      }
      //请求后端接口，验证用户和密码
      // 发起请求
      this.$http.post("/auth/accredit", this.$qs.stringify({
        username:this.username,
        password:this.password
      })).then(()=>{
        this.$message.success("登录成功！");
        this.$router.push("/item/list");
      }).catch(
       ()=>{
         this.$message.error("用户名密码错误");
       }
      )
    }
  }
};
</script>
