import React from 'react'
import './Index.css'
import { Link, Outlet, useLocation } from "react-router-dom"
import { useSelector } from 'react-redux'
import { Layout, Menu, Breadcrumb, Dropdown } from "antd"
import { DownOutlined } from "@ant-design/icons"
import storage from '../../utils/storage'
import permissionList from '../../utils/permission'

const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

const logout = () => {
  storage.remove('users');
}

const menu = (
  <Menu>
    <Menu.Item key="0">
      <Link to="/" onClick={logout}>修改密码</Link>
    </Menu.Item>
    <Menu.Item key="1">
      <Link to="/" onClick={logout}>退出登录</Link>
    </Menu.Item>
  </Menu>
);

export default function Index() {
  let { user } = useSelector((state) => state.users)
  let { pathname } = useLocation();
  let subMenuName = pathname.slice(0, pathname.lastIndexOf('/') );
  console.log(pathname === '/index/oa/home', subMenuName === '/index/oa');
  let Breadcrumb1 = permissionList.find(v=>v.key === subMenuName);
  let Breadcrumb2 = Breadcrumb1.children.find(v=>v.key === pathname);
  return (
    <Layout className="index">
      <Header className="header">
        <div className="logo">OA管理系统</div>
        <div className="user">{user.status}：
          <Dropdown overlay={menu}>
            <div className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              {user.name} <DownOutlined />
            </div>
          </Dropdown>
        </div>
      </Header>
      <Layout className="wrapper">
      <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={[pathname]}
            defaultOpenKeys={[subMenuName]}
            style={{ height: "100%", borderRight: 0 }}
          >
            {
              permissionList.filter((v)=>{
                return v.auths.includes(user.status);
              }).map((v)=>{
                return (
                  <SubMenu key={ v.key } icon={ v.icon } title={ v.title }>
                    {
                      v.children.filter((v)=>{
                        return v.auths.includes(user.status);
                      }).map((v)=>{
                        return (
                          <Menu.Item key={v.key}>
                            <Link to={v.key}>{v.title}</Link>
                          </Menu.Item>
                        )
                      })
                    }
                  </SubMenu>
                );
              })
            }
          </Menu>
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>{ Breadcrumb1.title }</Breadcrumb.Item>
            <Breadcrumb.Item>{ Breadcrumb2.title }</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}
