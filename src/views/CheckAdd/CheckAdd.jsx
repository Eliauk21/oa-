import React, { useEffect, useState } from 'react'
import './CheckAdd.css'
import { Button, Modal, Form, Input, Select, Row, Divider, Space, DatePicker, message, Table } from 'antd'
import { PlusCircleOutlined, CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons"
import { checkpersons, checkadd, checkfrom } from '../../api/checks'
import { useSelector } from 'react-redux'
import storage from '../../utils/storage'
import moment from 'moment'
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Column } = Table;
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 20,
  },
};

export default function CheckAdd() {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] =useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [persons, setPersons] = useState([]);
  const { user } = useSelector((state) => state.users)
  const id = storage.get('users').user.id;
  const initData = () => {
    checkfrom(id).then((res)=>{
      res.data.forEach(v => {
        v.checktime = moment(v.checktime[0]).format('YYYY-MM-DD hh:mm:ss') + ' - ' + moment(v.checktime[1]).format('YYYY-MM-DD hh:mm:ss');
        v.key = v.id;
      });
      setData(res.data)
    })
  }

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const onFinish = (values) => {
    setConfirmLoading(true);
    let [checktoid, checktoname] = values.checkperson.split('_');
    delete values.checkperson;
    checkadd({
      status: '审核中',
      checkfromid: id,
      checkfromname: user.name,
      checktoid,
      checktoname,
      ...values
    }).then((res)=>{
      message.success('添加成功！');
      initData();
      form.resetFields();
      setVisible(false);
      setConfirmLoading(false);
    }).catch(()=>{
      message.error('请重新填写！');
      setConfirmLoading(false);
    });

  };

  useEffect(()=>{
    initData();
    checkpersons().then((res)=>{
      setPersons(res.data)
    });
  }, [])

  return (
    <div className="checkadd">
      <Button className="addbtn" type="primary" icon={<PlusCircleOutlined />} onClick={showModal}>
        添加申请
      </Button>
      <Modal
        title="添加申请"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
          <Form.Item
            name="checkperson"
            label="审批人"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="请选择"
              allowClear
            >
              {
                persons.map((v)=>{
                  return <Option key={v.id} value={v.id + '_' + v.name}>{v.name}</Option>
                })
              }
            </Select>
          </Form.Item>
          <Form.Item
            name="checktype"
            label="请假事由"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="请选择"
              allowClear
            >
              <Option value="事假">事假</Option>
              <Option value="年假">年假</Option>
              <Option value="病假">病假</Option>
              <Option value="加班">加班</Option>
              <Option value="调休">调休</Option>
              <Option value="外出">外出</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="checktime"
            label="时间"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <RangePicker showTime />
          </Form.Item>
          <Form.Item
            name="checkinfo"
            label="备注"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <TextArea rows={4} />
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
        <Column title="申请人" dataIndex="checkfromname" key="checkfromname" />
        <Column title="请假事由" dataIndex="checktype" key="checktype" />
        <Column title="时间" dataIndex="checktime" key="checktime" />
        <Column title="备注" dataIndex="checkinfo" key="checkinfo" />
        <Column title="审批人" dataIndex="checktoname" key="checktoname" render={(text, record) => (
          <Space>
            {record.checktoname}
            { record.status === '通过' && <CheckCircleTwoTone twoToneColor="#52c41a" /> }
            { record.status === '不通过' && <CloseCircleTwoTone twoToneColor="#eb2f96" /> }
          </Space>
        )} />
        <Column title="状态" dataIndex="status" key="status" />
      </Table>
    </div>
  )
}
