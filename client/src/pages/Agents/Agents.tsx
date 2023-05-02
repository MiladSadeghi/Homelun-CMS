import React from "react";
import tw from "twin.macro";

function Agents() {
  return (
    <Wrapper>
      <nav tw="px-8 py-4 bg-white">
        <h3 tw="font-bold text-xl ">Agents</h3>
      </nav>
      <div tw="p-8">
        <table tw="w-full">
          <Thead>
            <Tr>
              <Th>Property ID</Th>
              <Th>Address</Th>
              <Th>Created Date</Th>
              <Th>Status</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <tbody></tbody>
        </table>
      </div>
    </Wrapper>
  );
}

const Wrapper = tw.div`w-full bg-[#F4F7FE] h-screen `;

const Thead = tw.thead`border-[#F4F7FE] border-[5px] border-solid`;
const Th = tw.th`text-left py-3 bg-white px-1 first-of-type:(rounded-tl-2xl rounded-bl-2xl) last-of-type:(rounded-tr-2xl rounded-br-2xl)`;
const Tr = tw.tr`border-[#F4F7FE] border-[5px] border-solid`;
const Td = tw.td`py-2 px-1 bg-white first-of-type:(rounded-tl-2xl rounded-bl-2xl) last-of-type:(rounded-tr-2xl rounded-br-2xl)`;

export default Agents;
