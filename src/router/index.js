
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from '../views/Login/Login';
import Index from '../views/Index/Index';
import OaHome from '../views/OaHome/OaHome';
import UsersList from '../views/UsersList/UsersList';
import CheckList from '../views/CheckList/CheckList';
import CheckChange from '../views/CheckChange/CheckChange';
import CheckAdd from '../views/CheckAdd/CheckAdd';
import NotFound from '../views/NotFound/NotFound';
import NotAuth from '../views/NotAuth/NotAuth';
import { useSelector } from 'react-redux';

export default function Router() {
  let { user } = useSelector((state) => state.users);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/index" element={
          user ? <Index></Index> : <Navigate replace to="/" />
        }>
          <Route path="oa/home" element={<OaHome />} />
          <Route path="users/list" element={ ['管理员'].includes(user?.status) ? <UsersList /> : <NotAuth /> } />
          <Route path="check/list" element={ ['经理', '员工'].includes(user?.status) ? <CheckList /> : <NotAuth />} />
          <Route path="check/change" element={ ['经理'].includes(user?.status) ? <CheckChange /> : <NotAuth /> } />
          <Route path="check/add" element={ ['员工'].includes(user?.status) ? <CheckAdd /> : <NotAuth /> } />
          <Route
              index
              element={ <Navigate replace to="/index/oa/home" /> }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}