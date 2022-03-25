
import http from "../utils/http";

function timeupdate(id, {month, date, time}) {
  let p = new Promise((resolve, reject)=>{
    http.get(`/times/${id}`).then((res)=>{
      if( res.data[month][date] ){
        res.data[month][date][1] = time;
      }
      else{
        res.data[month][date] = [time];
      }
      http.patch(`/times/${id}`, { [month]: res.data[month] }).then((res)=>{
        resolve(res);
      }).catch((err)=>{
        reject(err);
      });
    }).catch(()=>{
      let data = {id};
      for(let i=0;i<12;i++){
        data[i] = {};
        if(month === i){
          data[month][date] = [time];
        }
      }
      http.post(`/times`, data).then((res)=>{
        resolve(res);
      })
      .catch((err)=>{
        reject(err);
      });
    })
  });
  return p;
};

function timelist(id) {
  return http.get(`/times/${id}`); 
};

export {
  timeupdate,
  timelist
}