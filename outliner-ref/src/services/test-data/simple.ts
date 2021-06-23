const data = [
  {
    id: '上海',
    value: '上海',
    children: [],
  },
  {
    id: '江苏',
    value: '江苏',
    children: [
      {
        id: '南京',
        value: '南京',
        children: [{
          id: '秦淮', value: '秦淮', children: [],
        }, {
          id: '雨花台', value: '雨花台', children: [],
        }],
      },
      {
        id: '苏州',
        value: '苏州',
        children: [],
      },
    ],
  },
  {
    id: '引用节点测试',
    value: '![[南京]]',
    children: [],
  },
  {
    id: '引用节点测试2',
    value: '![[南京]]',
    children: [],
  },
]
export default data