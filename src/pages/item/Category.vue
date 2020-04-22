<template>
  <v-card>
    <v-flex xs12 sm10>
      <v-tree url="/item/category/list"
              :isEdit="isEdit"
              @handleAdd="handleAdd"
              @handleEdit="handleEdit"
              @handleDelete="handleDelete"
              @handleClick="handleClick"
      />
    </v-flex>
  </v-card>
</template>

<script>
  export default {
    name: "category",
    data() {
      return {
        isEdit: true
      }
    },
    methods: {
      handleAdd(node) {
        console.log("添加结点，信息如下：");
        console.log(node);
        if (node.parentId != 0) {
          // this.$message.confirm("确认？");
          this.$http.post('item/category/add', this.$qs.stringify(node))
            .then(function (response) {
              console.log(response.data);
              //更新数据
            })
            .catch(function (error) {
              //新增出错
              console.log(error);
            })
        } else {
          this.$message.error("请刷新后重试");
        }
      },
      handleEdit(id, name) {
        // console.log("更改id为: " + id + ", 名称为: " + name + " 的类目");
        const node = {
          id: id,
          name: name
        };
        this.$http({
          method: 'put',
          url: 'item/category/edit',
          data: this.$qs.stringify(node)
        }).then(
          function () {
            this.$message.info("修改成功！");
          },
        ).catch(
          function () {
            this.$message.error("修改失败！");
          },
        );
      },
      handleDelete(id) {
        console.log("删除id为：" + id + " 的类目")
        this.$http({
          method: 'delete',
          url: 'item/category/delete?id=' + id
        }).then(
          (res) => {
            this.$message.success("删除成功！")
          }
        ).catch(() => {
          this.$message.error("删除失败！")
        })
      },
      handleClick(node) {
        // console.log(node)
      }
    }
  };
</script>

<style scoped>

</style>
