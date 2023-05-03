import React, { useEffect, useState } from "react";
import tw, { styled } from "twin.macro";
import axiosInstance from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { publishAgent, setAgents } from "../../feature/lists/agentListSlice";
import { toast } from "react-toastify";
import { RootState } from "../../feature/store";
import { TAgent } from "../../types/user";
import { Link, useNavigate } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";

function Agents() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const agents: TAgent[] | null = useSelector(
    (state: RootState) => state.agentListSlice.agents
  );
  const [selectedAgent, setSelectedAgent] = useState<TAgent | null>();
  const urlParams = new URLSearchParams(window.location.search);
  const [search, setSearch] = useState<string>(urlParams.get("search") || "");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchAgents, setSearchAgents] = useState<TAgent[]>();
  const [isStatusLoading, isSetStatusLoading] = useState<boolean>(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (search !== "") {
      setIsSearching(true);
      urlParams.set("search", search);
      navigate(`?${urlParams.toString()}`, { replace: true });
      const searchResult = agents!.filter((agent: TAgent) =>
        agent.name.toLowerCase()?.includes(search)
      );
      setSelectedAgent(null);
      setSearchAgents(searchResult);
    } else {
      setIsSearching(false);
      urlParams.delete("search");
      navigate(`?${urlParams.toString()}`, { replace: true });
    }
  }, [search, navigate]);

  const changePublishProperty = async (publish: boolean) => {
    try {
      isSetStatusLoading(true);
      await axiosInstance.post("/agent/publish", {
        agentId: selectedAgent?._id!,
        status: publish,
      });

      dispatch(publishAgent({ agentId: selectedAgent?._id!, publish }));
      setSelectedAgent((prevState: any) => {
        return { ...prevState, publish };
      });
      updateSearchedProperty(publish);
      isSetStatusLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
      isSetStatusLoading(false);
    }
  };

  const updateSearchedProperty = async (value: boolean) => {
    if (isSearching) {
      setSearchAgents((prevAgents: any) => {
        const selectedAgentIndex = prevAgents.findIndex(
          (agent: TAgent) => agent._id === agent?._id
        );
        const updatedUser = {
          ...prevAgents[selectedAgentIndex],
          publish: value,
        };
        return [
          ...prevAgents.slice(0, selectedAgentIndex),
          updatedUser,
          ...prevAgents.slice(selectedAgentIndex + 1),
        ];
      });
    }
  };

  return (
    <Wrapper isLoading={isLoading}>
      <nav tw="grid-cols-12 gap-4 grid bg-white py-4 px-8 items-center">
        <h3 tw="font-bold text-xl col-span-1 w-fit">Agents</h3>
        <input
          tw="rounded-lg w-full col-span-9 drop-shadow-lg bg-purple-800 text-white px-3 h-9"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
        {selectedAgent && (
          <Button
            onClick={() =>
              changePublishProperty(selectedAgent.publish ? false : true)
            }
            disabled={isStatusLoading}
            isPublish={selectedAgent.publish}
          >
            {!selectedAgent.publish ? "Publish?" : "Un publish?"}
          </Button>
        )}
      </nav>
      <div tw="p-8">
        <table tw="w-full">
          <Thead>
            <Tr>
              <Th></Th>
              <Th tw="w-4/12">Name</Th>
              <Th>Cover</Th>
              <Th tw="w-2/12">Status</Th>
              <Th tw="w-2/12">Properties</Th>
              <Th tw="w-2/12"></Th>
            </Tr>
          </Thead>
          <tbody>
            {(agents || searchAgents) &&
              (isSearching ? searchAgents : agents)?.map((agent: TAgent) => (
                <Tr key={agent._id}>
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
const Button = styled.button`
  ${tw`py-2 px-3 rounded-xl  text-white text-sm flex items-center font-semibold col-span-2 disabled:opacity-60`} ${({
    isPublish,
  }: {
    isPublish: boolean;
  }) => (isPublish ? tw`bg-yellow-600` : tw`bg-green-700`)}
`;
export default Agents;
