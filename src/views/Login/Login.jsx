import React from 'react'
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux'
import storage from '../../utils/storage';
import { login } from '../../api/users';

export default function Login() {

  let navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    //console.log('Success:', values);
    login({
      email: values.username,
      password: values.password
    }).then((res)=>{
      storage.set('users', res.data);  
      dispatch({type: 'USERS_UPDATE', payload: res.data});
      navigate('/index/oa/home');
    }).catch((err)=>{
      message.error('用户名或密码错误！');
    })
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      className="login"
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="on"
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[
          {
            required: true,
            message: '请输入正确的用户名!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[
          {
            required: true,
            message: '请输入正确的密码!',
          },
        ]}
      >
      <Input.Password />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          登录
        </Button>
      </Form.Item>
    </Form>
  )
}
