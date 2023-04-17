import React from "react";
import Logo from "../../helper/Logo";
import tw from "twin.macro";
import { useSelector } from "react-redux";
import { RootState } from "../../feature/store";
import menuItemByRole from "../RoleBasedMenuItem";
import { TRole, TRoleMenuItem } from "../../types/role";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

function Menu() {
  const userRole: TRole | any = useSelector(
    (state: RootState) => state.userSlice.role
  );

  return (
    <Wrapper>
      <div tw="py-9 text-center w-full">
        <Logo color="dark" />
      </div>
      <div tw="w-full">
        {menuItemByRole(userRole).map((item: TRoleMenuItem) => (
          <Item key={item.name} to={item.link}>
            <item.icon size={20} />
            <ItemContent>{item.name}</ItemContent>
          </Item>
        ))}
      </div>
    </Wrapper>
  );
}

const Wrapper = tw.div`flex flex-col w-[20%] h-screen items-center shadow-lg`;
const Item = styled(NavLink)`
  ${tw`text-center py-4 mb-3 font-bold w-full justify-center items-center flex`} &.active {
    ${tw`bg-[#efe9ff] text-purple-800 font-bold relative before:(absolute left-0 top-0 h-full w-[2px] bg-purple-800)`}
  }
`;

const ItemContent = tw.div`ml-2`;

export default Menu;
