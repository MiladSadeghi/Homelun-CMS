import React, { useState } from "react";
import { BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import tw from "twin.macro";

function Properties() {
  return (
    <Wrapper>
      <div tw="grid-cols-12 gap-4 grid">
        <Link
          to="/properties/add"
          tw="py-1 px-3 rounded-3xl bg-emerald-800 text-white text-sm flex items-center font-semibold col-span-1 w-fit"
        >
          ADD NEW
          <BiPlus size={18} tw="ml-1" />
        </Link>
      </div>
    </Wrapper>
  );
}

const Wrapper = tw.div`w-full bg-[#F4F7FE] h-screen p-8`;

export default Properties;
