import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Home from "../../pages/Home";
import { useSelector } from "react-redux";
import { RootState } from "../../feature/store";
import axios from "axios";

function PrivateRoute() {
  const isUserAuthenticated: Boolean = useSelector(
    (state: RootState) => state.userSlice.isAuthenticated
  );

  return isUserAuthenticated ? (
    <>
      <h1>test</h1>
      <Outlet />
    </>
  ) : null;
}

export default PrivateRoute;
