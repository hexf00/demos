const data = [
  {
    id: 'a',
    value: 'a',
    children: [],
  },
  {
    id: 'b',
    value: 'b',
    children: [
      {
        id: 'b1',
        value: 'b1',
        children: [{
          id: 'b11', value: 'b11', children: [],
        }, {
          id: 'b12', value: 'b12', children: [],
        }],
      },
      {
        id: 'b2',
        value: 'b2',
        children: [
          {
            id: '引用节点测试2',
            value: '![[c]]',
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 'c',
    value: 'c',
    children: [
      {
        id: '引用节点测试2',
        value: '![[b1]]',
        children: [],
      },
    ],
  },
  {
    id: '引用节点测试',
    value: '![[b1]]',
    children: [],
  },
  {
    id: '引用节点测试2',
    value: '![[b1]]',
    children: [],
  },
]
export default data