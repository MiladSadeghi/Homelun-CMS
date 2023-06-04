import React from "react";
import { useSelector } from "react-redux";
import tw, { styled } from "twin.macro";
import { RootState } from "../../feature/store";
import { Link } from "react-router-dom";
import { BiPlus } from "react-icons/bi";
import axiosInstance from "../../services/api";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { TAgent } from "../../types/user";
import { TProperty } from "../../types/property";

type TTourRequest = {
  _id: string;
  name: string;
  email: string;
  agent: TAgent;
  property: TProperty;
  request: string;
  createdAt: Date;
};

const TourRequests = () => {
  const userRole = useSelector((state: RootState) => state.userSlice.role);
  const agentId = useSelector(
    (state: RootState) => state.userSlice.agentProfile?._id
  );
  const [search, setSearch] = React.useState<string>("");
  const [tourRequest, setTourRequest] = React.useState<TTourRequest[] | null>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [searchTourRequest, setSearchTourRequest] = React.useState<
    TTourRequest[] | null
  >();

  React.useEffect(() => {
    setIsLoading(true);
    if (
      userRole !== "agent" ||
      (userRole === "agent" && agentId !== undefined)
    ) {
      axiosInstance
        .get(`/tour${userRole === "agent" ? `/${agentId}` : ""}`)
        .then((response) => setTourRequest(response.data.tours))
        .catch((error) => toast.error(error.message))
        .finally(() => setIsLoading(false));
    }
  }, [agentId]);

  React.useEffect(() => {
    const foundedTourRequests = tourRequest?.filter((tour: TTourRequest) =>
      tour.email.includes(search)
    );
    setSearchTourRequest(foundedTourRequests);
  }, [search]);

  return (
    <Wrapper>
      <nav className="flex items-center gap-4 bg-white py-4 px-8 sticky top-0">
        <h3 className="font-bold text-xl min-w-fit">Tour Requests</h3>
        <input
          tw="rounded-lg w-full drop-shadow-lg bg-purple-800 text-white px-3 h-9"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
      </nav>
      <div className="p-8">
        {tourRequest && tourRequest.length === 0 ? (
          <>Cant Find Any Data</>
        ) : (
          <table tw="w-full">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Message</Th>
                {userRole !== "agent" && <Th>For Agent</Th>}
                <Th>Property Address</Th>
                <Th>Created At</Th>
              </Tr>
            </Thead>
            <tbody>
              {(search !== "" ? searchTourRequest : tourRequest)?.map(
                (tour: TTourRequest) => (
                  <Tr key={tour._id}>
                    <Td>{tour.name}</Td>
                    <Td>{tour.email}</Td>
                    <Td>{tour.request}</Td>
                    {userRole !== "agent" && <Td>{tour.agent.name}</Td>}
                    <Td>{tour.property.address}</Td>
                    <Td>
                      {new Date(tour.createdAt).toLocaleString("en-US", {
                        timeZone:
                          Intl.DateTimeFormat().resolvedOptions().timeZone,
                      })}
                    </Td>
                  </Tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
      <Loader isLoading={isLoading} />
    </Wrapper>
  );
};

const Wrapper = tw.div`w-full bg-[#F4F7FE] h-screen relative col-span-10`;

const Thead = tw.thead`border-[#F4F7FE] border-[5px] border-solid`;
const Th = tw.th`text-left py-3 bg-white px-1 first-of-type:(rounded-tl-2xl rounded-bl-2xl) last-of-type:(rounded-tr-2xl rounded-br-2xl)`;
const Tr = styled.tr`
  ${tw`border-[#F4F7FE] border-[5px] border-solid first:(rounded-tl-2xl rounded-bl-2xl) last:(rounded-tr-2xl  rounded-br-2xl) transition-all  duration-75`}
`;
const Td = tw.td`py-2 px-1 bg-white`;

export default TourRequests;
