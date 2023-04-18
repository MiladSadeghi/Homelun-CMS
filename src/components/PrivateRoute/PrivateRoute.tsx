import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../feature/store";
import Menu from "../Menu/Menu";
import tw from "twin.macro";

function PrivateRoute() {
  const isUserAuthenticated: Boolean = useSelector(
    (state: RootState) => state.userSlice.isAuthenticated
  );

  return isUserAuthenticated ? (
    <Wrapper>
      <Menu />
      <Outlet />
    </Wrapper>
  ) : null;
}

const Wrapper = tw.div`flex`;

export default PrivateRoute;
