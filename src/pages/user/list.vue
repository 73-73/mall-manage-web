<template>
  <v-card>
    <v-toolbar class="elevation-0">
      <v-spacer/>
      <v-flex xs3>
        状态：
        <v-btn-toggle mandatory v-model.lazy="filter.usable">
          <v-btn flat>
            全部
          </v-btn>
          <v-btn flat :value="false">
            冻结
          </v-btn>
          <v-btn flat :value="true">
            正常
          </v-btn>
        </v-btn-toggle>
      </v-flex>
      <v-flex xs3>
        <v-text-field
          append-icon="search"
          label="搜索"
          single-line
          hide-details
          v-model="filter.search"
        />
      </v-flex>
    </v-toolbar>
    <v-divider/>
    <v-data-table
      :headers="headers"
      :items="userList"
      :pagination.sync="pagination"
      :total-items="totalUser"
      :loading="loading"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <!--<td class="text-xs-center">{{ props.item.id }}</td>-->
        <td class="text-xs-center">{{ props.item.username }}</td>
        <td class="text-xs-center" >{{role(props.item.permission)}}</td>
        <td class="text-xs-center">{{props.item.phone}}</td>
<!--        <td class="text-xs-center">{{ props.item.created }}</td>-->
        <td class="text-xs-center">{{ props.item.usable?"正常":"被冻结"}}</td>
        <td class="justify-center layout px-0">
<!--          <v-btn icon @click="deleteGoods(props.item.id)">-->
<!--            <i class="el-icon-delete"/>-->
<!--          </v-btn>-->
          <v-btn icon v-if="props.item.usable" @click="freeze(props.item.id,false)" color="red">冻结</v-btn>
          <v-btn icon v-else @click="freeze(props.item.id,true)" color="green">解冻</v-btn>
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  // 导入自定义的表单组件
  export default {
    name: "userList",
    data() {
      return {
        filter: {
          usable: true, // 上架还是下架
          search: '', // 搜索过滤字段,可以通过会员名称搜索
        },
        totalUser: 0, // 总条数
        userList: [], // 当前页品牌数据
        loading: true, // 是否在加载中
        pagination: {}, // 分页信息
        headers: [
          {text: '会员名', align: 'center', sortable: false, value: 'username'},
          {text: '类别', align: 'center', sortable: false, value: 'permission'},
          {text: '电话', align: 'center', sortable: false, value: 'phone'},
          // {text: '地址', align: 'center', value: 'address', sortable: false,},
          // {text: '创建时间', align: 'center', value: 'created',sortable: false},
          {text: '状态', align: 'center', value: 'usable',sortable: false},
          {text: '操作', align: 'center', sortable: false},

        ],
      }
    },
    mounted() { // 渲染后执行
      // 查询数据
      this.getDataFromServer();
    },
    watch: {
      pagination: { // 监视pagination属性的变化
        deep: true, // deep为true，会监视pagination的属性及属性中的对象属性变化
        handler() {
          // 变化后的回调函数，这里我们再次调用getDataFromServer即可
          //if(!(this.pagination.page == 1 && this.pagination.rowsPerPage ==5)){
          this.getDataFromServer();
          //}
        }
      },
      filter: {// 监视搜索字段
        handler() {
          this.getDataFromServer();
        },
        deep: true
      }
    },
    methods: {
      getDataFromServer() { // 从服务的加载数的方法。
        // 发起请求
        this.$http.get("/user/page", {
          params: {
            key: this.filter.search, // 搜索条件
            usable: this.filter.usable === 0 ? null : this.filter.usable, // 上下架
            page: this.pagination.page,// 当前页
            rows: this.pagination.rowsPerPage,// 每页大小
          }
        }).then(resp => { // 这里使用箭头函数
          this.userList = resp.data.items;
          this.totalUser = resp.data.total;
          // 完成赋值后，把加载状态赋值为false
          this.loading = false;
        }).catch(
          () => {
            this.userList = [];
            this.totalUser = 0;
            this.loading = false;
            this.$message.info("此条件下无数据！");
          }
        )
      },
      // deleteGoods(spuId) {
      //   this.$message.confirm("确认删除？").then(
      //     () => {
      //       //发起请求，通过spuId删除改商品
      //       this.$http.delete("item/spu/delete/" + spuId)
      //         .then(res => {
      //           this.$message.success("删除成功！");
      //           this.getDataFromServer();
      //         })
      //         .catch(res => {
      //           this.$message.error("删除失败，刷新后重试");
      //         })
      //     }
      //   )
      // },
      freeze(userId, usable) {
        //如果usable为true，说明需要冻结，否则解冻
        //发起请求，通过spuId删除改商品
        console.log(userId);
        this.$http.put("user/usable", this.$qs.stringify({
          id: userId,
          usable: usable
        }))
          .then(res => {
            this.$message.success("操作成功！");
            this.getDataFromServer();
          })
          .catch(res => {
            this.$message.error("操作失败，刷新后重试");
          })
      },
      role(per){
        if(per ===1){
          return "管理员";
        }
        else if(per ===2){
          return "商家";
        }
        else if(per ===3){
          return "买家";
        }
        return "";
      }
    },
  }
</script>

<style scoped>

</style>
