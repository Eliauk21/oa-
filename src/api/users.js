import http from "../utils/http";

function login(data){
  return http.post('/login', data);
}

function register(data){
  return http.post('/register', data);
}

function users(){
  return http.get('/users');
}

function deleteUser(id){
  return http.delete(`/users/${id}`);
}

export {
  login,
  register,
  users,
  deleteUser
}