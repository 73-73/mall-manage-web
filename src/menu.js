var menus = [
  {
    action: "apps",
    title: "商品管理",
    path:"/item",
    items: [
      { title: "分类管理", path: "/category" },
      { title: "品牌管理", path: "/brand" },
      { title: "商品列表", path: "/list" },
      { title: "规格参数", path: "/specification" }
    ]
  },
  {
    action: "people",
    title: "会员管理",
    path:"/user",
    items: [
      { title: "会员管理", path: "/list" }
    ]
  },
  {
    action: "attach_money",
    title: "销售管理",
    path:"/trade",
    items: [
      { title: "订单管理", path: "/order" }
    ]
  }
];

export default menus;
