import React, { useEffect, useState } from 'react'
import './CheckList.css';
import { timeupdate, timelist } from '../../api/times'
import { Calendar, Button, message } from 'antd';
import { PlusCircleOutlined } from "@ant-design/icons"
import moment from 'moment';
import storage from '../../utils/storage';

const nowMonth = new Date().getMonth();
const dateRange = [ moment(`${new Date().getFullYear()}-01-01`), moment(`${new Date().getFullYear()}-12-31`) ];

export default function CheckList() {

  const [data, setData] = useState(null);
  const id = storage.get('users').user.id;
  const initData = () => {
    timelist(id).then((res)=>{
      setData(res.data);
    }).catch(()=>{});
  }

  const onPanelChange = (value, mode) => {
    //console.log(value.format('YYYY-MM-DD'), mode);
    nowMonth = value.month();
  }

  const dateCellRender = (value) => {
    //console.log(value.date());
    //console.log(value.month());
    if( nowMonth === value.month() && data ){
      let nowDay = data[nowMonth] && data[nowMonth][value.date()];
      if( nowDay ){
        return (
          <div>
            <p style={{ background: nowDay[0] < '08:00:00' ? '' : 'red' }}>上班打卡：{ nowDay[0] }</p>
            <p style={{ background: nowDay[1] > '18:00:00' ? '' : 'red' }}>下班打卡：{ nowDay[1] }</p>
          </div>
        )
      }
    }
  }

  const handleUpdate = () => {
    let d = new Date();
    let month = d.getMonth();
    let date = d.getDate();
    let time = moment(d).format('hh:mm:ss');
    timeupdate(id, { month, date, time }).then(()=>{
      message.success('签到成功');
      initData();
    }).catch(()=>{
      message.error('签到失败');
    })
  }
  useEffect(()=>{
    initData();
  }, []);

  return (
    <div className="checklist">
      <div className="addwrapper">
        <Button className="addbtn" type="primary" icon={<PlusCircleOutlined />} onClick={handleUpdate}>
          在线签到
        </Button>
      </div>
      <Calendar validRange={dateRange} onPanelChange={onPanelChange} dateCellRender={dateCellRender} />
    </div>
  )
}
