import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Menu from "../Menu/Menu";
import tw from "twin.macro";

function PrivateRoute() {
  return (
    <Wrapper>
      <Menu />
      <Outlet tw="col-span-9" />
    </Wrapper>
  );
}

const Wrapper = tw.div`grid grid-cols-12`;

export default PrivateRoute;
