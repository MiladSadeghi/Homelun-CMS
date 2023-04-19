import React from "react";
import tw from "twin.macro";
import { BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";

function Users() {
  return (
    <Wrapper>
      <div tw="flex">
        <Link
          to="/users/add"
          tw="py-1 px-3 rounded-3xl bg-blue-500 text-white text-sm flex items-center font-semibold"
        >
          ADD NEW
          <BiPlus size={18} tw="ml-1" />
        </Link>
      </div>
    </Wrapper>
  );
}

const Wrapper = tw.div`w-full bg-[#F4F7FE] h-screen p-8`;

export default Users;
