import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined
} from "@ant-design/icons"

let permissionList = [
  {
    key: '/index/oa',
    icon: <UserOutlined />,
    title: 'OA系统',
    auths: ['管理员', '经理', '员工'],
    children: [
      {
        key: '/index/oa/home',
        title: '后台首页',
        auths: ['管理员', '经理', '员工']
      }
    ]
  },
  {
    key: '/index/users',
    icon: <LaptopOutlined />,
    title: '用户管理',
    auths: ['管理员'],
    children: [
      {
        key: '/index/users/list',
        title: '用户列表',
        auths: ['管理员']
      }
    ]
  },
  {
    key: '/index/check',
    icon: <NotificationOutlined />,
    title: '考勤管理',
    auths: ['经理', '员工'],
    children: [
      {
        key: '/index/check/list',
        title: '我的考勤',
        auths: ['经理', '员工']
      },
      {
        key: '/index/check/change',
        title: '我的审批',
        auths: ['经理']
      },
      {
        key: '/index/check/add',
        title: '请假加班',
        auths: ['员工']
      }
    ]
  }
];

export default permissionList;