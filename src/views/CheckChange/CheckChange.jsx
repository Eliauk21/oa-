import React, {useState, useRef, useEffect} from 'react'
import { Table, Button, Popconfirm, message } from 'antd';
import { checkto, checkstatus } from '../../api/checks'
import moment from 'moment'
import storage from '../../utils/storage'
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
const { Column } = Table;


export default function CheckChange() {
  const [data, setData] = useState([]);
  const id = storage.get('users').user.id;
  const initData = () => {
    checkto(id).then((res)=>{
      res.data.forEach(v => {
        v.checktime = moment(v.checktime[0]).format('YYYY-MM-DD hh:mm:ss') + ' - ' + moment(v.checktime[1]).format('YYYY-MM-DD hh:mm:ss');
        v.key = v.id;
      });
      setData(res.data);
    })
  };
  function confirm(id) {
    checkstatus(id, {status: '通过'}).then((res)=>{
      initData();
      message.success('审核成功');
    }).catch(()=>{
      message.error('审核失败');
    })
  }
  function cancel(id) {
    checkstatus(id, {status: '不通过'}).then((res)=>{
      initData();
      message.success('审核成功');
    }).catch(()=>{
      message.error('审核失败');
    })
  }
  useEffect(()=>{
    initData();
  }, []);
  return (
    <div>
      <Table dataSource={data}>
        <Column title="申请人" dataIndex="checkfromname" key="checkfromname" />
        <Column title="请假事由" dataIndex="checktype" key="checktype" />
        <Column title="时间" dataIndex="checktime" key="checktime" />
        <Column title="备注" dataIndex="checkinfo" key="checkinfo" />
        <Column title="审批人" dataIndex="checktoname" key="checktoname" />
        <Column title="状态" dataIndex="status" key="status" render={(text, record) => (
           <div>
            { record.status === '通过' && <CheckCircleTwoTone twoToneColor="#52c41a" /> }
            { record.status === '不通过' && <CloseCircleTwoTone twoToneColor="#eb2f96" /> }
            <Popconfirm
              title="审批是否通过?"
              onConfirm={()=>{ confirm(record.id) }}
              onCancel={()=>{ cancel(record.id) }}
              okText="通过"
              cancelText="不通过"
            >
              { record.status === '审核中' && <Button type="primary">{record.status}</Button> }
              </Popconfirm>
          </div>
        )} />
      </Table>
    </div>
  )
}
