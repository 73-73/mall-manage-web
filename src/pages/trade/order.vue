<template>
  <v-card>
    <v-toolbar class="elevation-0">
      <v-spacer/>
      <v-flex xs6>
        状态：
        <v-btn-toggle mandatory v-model.lazy="filter.status">
          <v-btn flat>
            全部
          </v-btn>
          <v-btn flat :value="1">
            未发货
          </v-btn>
          <v-btn flat :value="2">
            已发货
          </v-btn>
          <v-btn flat :value="3">
            交易成功
          </v-btn>
          <v-btn flat :value="4">
            交易关闭
          </v-btn>
        </v-btn-toggle>
      </v-flex>
      <v-flex xs2>
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
      :items="orderList"
      :pagination.sync="pagination"
      :total-items="totalOrder"
      :loading="loading"
      class="elevation-1"
    >
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.orderId }}</td>
        <td class="text-xs-center">{{ props.item.title }}</td>
        <td class="text-xs-center">{{props.item.buyerNick}}</td>
        <td class="text-xs-center">￥{{props.item.actualPay/100}}</td>
        <td class="text-xs-center">
          <img v-if="props.item.image" :src="props.item.image" width="60" height="60">
          <span v-else>无</span>
        </td>
        <td class="text-xs-center">{{statusFun(props.item.status)}}</td>
        <td class="justify-center layout px-0">
          <v-btn icon v-show="props.item.status>0&&props.item.status<3"
                 @click="changeStatus(props.item.orderId,props.item.status+1)" color="blue">
            {{statusFun(props.item.status+1)}}
          </v-btn>
          <v-btn icon v-show="props.item.status<3" @click="changeStatus(props.item.orderId,4)" color="red">关闭</v-btn>
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>

  var statusArr = ["未发货", "发货", "完成", "关闭"];

  // 导入自定义的表单组件
  export default {
    name: "orderList",
    data() {
      return {
        filter: {
          status: 1, // 上架还是下架
          search: '', // 搜索过滤字段,可以通过会员名称搜索
        },
        totalOrder: 0, // 总条数
        orderList: [], // 当前页品牌数据
        loading: true, // 是否在加载中
        pagination: {}, // 分页信息
        headers: [
          {text: '订单号', align: 'center', sortable: false, value: 'orderId'},
          {text: '订单信息', align: 'center', sortable: false, value: 'title'},
          {text: '买家昵称', align: 'center', sortable: false, value: 'buyerNick'},
          {text: '实付金额', align: 'center', sortable: false, value: 'actualPay'},
          {text: '图片', align: 'center', sortable: false, value: 'image'},
          // {text: '收货地址', align: 'center', sortable: false, value: 'address'},
          {text: '状态', align: 'center', sortable: false, value: 'status'},
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
        this.$http.get("/order/page", {
          params: {
            key: this.filter.search, // 搜索条件
            status: this.filter.status === 0 ? null : this.filter.status,
            page: this.pagination.page,// 当前页
            rows: this.pagination.rowsPerPage,// 每页大小
          }
        }).then(resp => { // 这里使用箭头函数
          this.orderList = resp.data.items;
          this.totalOrder = resp.data.total;
          // 完成赋值后，把加载状态赋值为false
          this.loading = false;
        }).catch(
          () => {
            this.orderList = [];
            this.totalOrder = 0;
            this.loading = false;
            this.$message.info("此条件下无数据！");
          }
        )
      },
      changeStatus(orderId, status) {
        //如果usable为true，说明需要冻结，否则解冻
        //发起请求，通过spuId删除改商品
        // console.log(orderId);
        this.$http.put("order/" + orderId + "/" + status)
          .then(res => {
            this.$message.success("操作成功！");
            this.getDataFromServer();
          })
          .catch(res => {
            this.$message.error("操作失败，刷新后重试");
          })
      },
      statusFun(status) {
        return statusArr[status - 1];
      }
    },
  }
</script>

<style scoped>

</style>
