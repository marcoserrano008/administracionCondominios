import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import storage from '../storage/storage';
import { isAuthenticated, getUserRole } from '../AuthHelpers';

export const ProtectedRoutes = ({children}) => {

  if(!isAuthenticated()){
    return <Navigate to='/login' />
  }
    return <Outlet/>
}
export default ProtectedRoutes