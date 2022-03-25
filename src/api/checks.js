import http from "../utils/http";

function checkpersons(){
  return http.get('/users?status=经理');
}

function checkadd(data){
  return http.post('/checks', data);
}

function checkfrom(id){
  return http.get(`/checks?checkfromid=${id}`);
}

function checkto(id){
  return http.get(`/checks?checktoid=${id}`);
}

function checkstatus(id, data){
  return http.patch(`/checks/${id}`, data);
}

export {
  checkpersons,
  checkadd,
  checkfrom,
  checkto,
  checkstatus
}