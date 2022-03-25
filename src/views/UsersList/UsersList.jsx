import React, { useState, useEffect } from 'react'
import './UsersList.css'
import { Table, Button, Space, Modal, Form, Input, Select, Row, Divider, message, Popconfirm } from 'antd';
import { PlusCircleOutlined } from "@ant-design/icons"
import { register, users, deleteUser } from '../../api/users';

const { Option } = Select;
const { Column } = Table;
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

export default function UsersList() {

  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [confirmLoading, setConfirmLoading] =useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);

  const initData = () => {
    users().then((res)=>{
      res.data.forEach(v => {
        v.key = v.id;
      })
      setData(res.data);
    })
  }

  const onFinish = (values) => {
    let password = values.email.split('@')[0];
    setConfirmLoading(true);
    register({
      password,
      ...values
    }).then((res)=>{
      initData();
      message.success('添加成功！');
      form.resetFields();
      setVisible(false);
      setConfirmLoading(false);
    }).catch(()=>{
      message.error('请重新填写！');
      setConfirmLoading(false);
    });
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleRemove = (id) => {  
    deleteUser(id).then((res)=>{
      initData();
      message.success('删除成功！');
    }).catch(()=>{
      message.error('删除失败！');
    })
  }
  
  useEffect(() => {
    initData();
  }, [])

  return (
    <div className="userslist">
      <Button className="addbtn" type="primary" icon={<PlusCircleOutlined />} onClick={showModal}>
        添加用户
      </Button>
      <Modal
        title="添加用户"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item
            name="name"
            label="用户名"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="status"
            label="职位"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="请选择职位"
              allowClear
            >
              <Option value="经理">经理</Option>
              <Option value="员工">员工</Option>
            </Select>
          </Form.Item>
          <Divider />
          <Row justify="end">
            <Space>
              <Button onClick={handleCancel}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={confirmLoading}>
                确定
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
      <Table dataSource={data}>
        <Column title="用户名" dataIndex="name" key="name" />
        <Column title="邮箱" dataIndex="email" key="email" />
        <Column title="职位" dataIndex="status" key="status" />
        <Column title="操作" 
        key="action"
        render={(text, record) => (
          <Space size="middle">
            {
              text.status === '管理员' 
              ? <><Button type="primary" disabled>编辑</Button><Button type="primary" danger disabled>删除</Button></>
              : <>
                  <Button type="primary">编辑</Button>
                  <Popconfirm
                    title="是否删除当前用户?"
                    onConfirm={ () => { handleRemove(text.id) }}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button type="primary" danger>删除</Button>
                  </Popconfirm>
                </>
            }
          </Space>
        )} />
      </Table>
    </div>
  )
}
