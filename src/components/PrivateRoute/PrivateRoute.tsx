import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Menu from "../Menu/Menu";
import tw from "twin.macro";

function PrivateRoute() {
  return (
    <Wrapper>
      <Menu />
      <Outlet />
    </Wrapper>
  );
}

const Wrapper = tw.div`flex`;

export default PrivateRoute;
