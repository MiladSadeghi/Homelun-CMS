import React, { useEffect, useState } from "react";
import tw, { styled } from "twin.macro";
import axiosInstance from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { setAgents } from "../../feature/lists/agentListSlice";
import { toast } from "react-toastify";
import { RootState } from "../../feature/store";
import { TAgent } from "../../types/user";
import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";

function Agents() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const agents: TAgent[] | null = useSelector(
    (state: RootState) => state.agentListSlice.agents
  );
  const [selectedAgent, setSelectedAgent] = useState<TAgent | null>();

  useEffect(() => {
    const getAgents = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get("agent/all");
        dispatch(setAgents(data.agents));
        setIsLoading(false);
      } catch (error: any) {
        console.log(error);
        toast.error(error.response.data.message || "refresh page");
        setIsLoading(false);
      }
    };
    getAgents();
  }, []);

  return (
    <Wrapper isLoading={isLoading}>
      <nav tw="px-8 py-4 bg-white">
        <h3 tw="font-bold text-xl ">Agents</h3>
      </nav>
      <div tw="p-8">
        <table tw="w-full">
          <Thead>
            <Tr>
              <Th></Th>
              <Th>Cover</Th>
              <Th>Name</Th>
              <Th>Status</Th>
              <Th>Properties</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <tbody>
            {agents &&
              agents?.map((agent: TAgent) => (
                <Tr>
                  <Td>
                    <input
                      type="checkbox"
                      name="select-property"
                      checked={selectedAgent?._id === agent?._id}
                      onChange={() => setSelectedAgent(agent)}
                      tw="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 align-middle mx-auto"
                    />
                  </Td>
                  <Td>{agent.name}</Td>
                  <Td>
                    <img
                      src={agent.cover}
                      width={64}
                      height={64}
                      tw="rounded-full"
                    />
                  </Td>

                  <Td>
                    {agent.publish ? (
                      <Badge tw="border-green-800 bg-green-600 text-green-800 bg-opacity-20">
                        Publish
                      </Badge>
                    ) : (
                      <Badge tw="border-yellow-600 bg-yellow-300 bg-opacity-20 text-yellow-600">
                        Unpublished
                      </Badge>
                    )}
                  </Td>
                  <Td>
                    <Edit
                      to="#"
                      tw="bg-indigo-200 border-indigo-700 text-indigo-700"
                    >
                      Show Properties
                    </Edit>
                  </Td>
                  <Td>
                    <Edit to="#">
                      Edit Profile <HiArrowRight tw="ml-2" />
                    </Edit>
                  </Td>
                </Tr>
              ))}
          </tbody>
        </table>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  ${tw`w-full bg-[#F4F7FE] h-screen relative`} ${({
    isLoading,
  }: {
    isLoading: boolean;
  }) =>
    isLoading
      ? tw`after:(left-0 top-0 bg-gray-300 absolute w-full h-full bg-opacity-50)`
      : tw``}
`;

const Thead = tw.thead`border-[#F4F7FE] border-[5px] border-solid`;
const Th = tw.th`text-left py-3 bg-white px-1 first-of-type:(rounded-tl-2xl rounded-bl-2xl) last-of-type:(rounded-tr-2xl rounded-br-2xl)`;
const Tr = tw.tr`border-[#F4F7FE] border-[5px] border-solid`;
const Td = tw.td`py-2 px-1 bg-white first-of-type:(rounded-tl-2xl rounded-bl-2xl) last-of-type:(rounded-tr-2xl rounded-br-2xl)`;

const Badge = tw.span`border border-solid rounded-lg  px-2 py-[2px] text-xs font-bold`;
const Edit = tw(
  Link
)` py-2 px-4 bg-blue-200 border border-solid border-blue-700 text-blue-700 text-sm font-bold rounded-xl flex items-center justify-center w-fit`;

export default Agents;
