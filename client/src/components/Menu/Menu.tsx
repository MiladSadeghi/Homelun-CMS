import React, { useEffect, useState } from "react";
import Logo from "../../helper/Logo";
import tw from "twin.macro";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../feature/store";
import menuItemByRole from "../RoleBasedMenuItem";
import { TRole, TRoleMenuItem } from "../../types/role";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { BiLogOut } from "react-icons/bi";
import { toast } from "react-toastify";
import { userLogout } from "../../feature/user/userSlice";
import axiosInstance from "../../services/api";

function Menu() {
  const userRole: TRole | any = useSelector(
    (state: RootState) => state.userSlice.role
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.delete("user/logout");
      dispatch(userLogout());
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error.response.data.message);
      setIsLoading(true);
    }
  };

  return (
    <Wrapper>
      <div tw="flex flex-col justify-between items-center h-screen fixed shadow-lg bg-white w-[320px]">
        <div tw="w-full">
          <div tw="py-9 text-center w-full">
            <Logo color="dark" />
          </div>
          <div tw="w-full flex flex-col justify-between">
            {menuItemByRole(userRole).map((item: TRoleMenuItem) => (
              <Item key={item.name} to={item.link}>
                <item.icon size={20} />
                <ItemContent>{item.name}</ItemContent>
              </Item>
            ))}
          </div>
        </div>
        <Button onClick={handleLogout} disabled={isLoading}>
          <BiLogOut size={20} />
          <ItemContent>Logout</ItemContent>
        </Button>
      </div>
    </Wrapper>
  );
}

const Wrapper = tw.div`col-span-2`;
const Item = styled(NavLink)`
  ${tw`py-4 px-3 mb-3 font-bold w-full items-center flex`} &.active {
    ${tw`bg-[#efe9ff] text-purple-800 font-bold relative before:(absolute left-0 top-0 h-full w-[2px] bg-purple-800)`}
  }
`;

const Button = tw.button`py-4 px-3 font-bold w-full items-center flex bg-purple-900 text-white disabled:opacity-60`;

const ItemContent = tw.div`ml-2`;

export default Menu;
