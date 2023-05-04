import React, { useEffect, useState } from "react";
import tw, { styled } from "twin.macro";
import { BiPlus } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../feature/store";
import { disableUser, setUsers } from "../../feature/lists/userListSlice";
import { TUsers } from "../../types/user";
import { toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";

function Users() {
  const dispatch: AppDispatch = useDispatch();
  const users: TUsers[] | null = useSelector(
    (state: RootState) => state.userListSlice.users
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const urlParams = new URLSearchParams(window.location.search);
  const [search, setSearch] = useState<string>(urlParams.get("search") || "");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchUsers, setSearchUsers] = useState<TUsers[]>();
  const [disableLoading, setDisableLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<TUsers | null>();
  const navigate = useNavigate();

  useEffect(() => {
    const getAgents = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get("user");
        dispatch(setUsers(data.users));
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
      const searchResult = users!.filter((user: TUsers) =>
        user.name!.toLowerCase()?.includes(search)
      );
      setSelectedUser(null);
      setSearchUsers(searchResult);
    } else {
      setIsSearching(false);
      urlParams.delete("search");
      navigate(`?${urlParams.toString()}`, { replace: true });
    }
  }, [search, navigate]);

  const changeDisabledStatus = async (disable: boolean) => {
    try {
      setDisableLoading(true);
      await axiosInstance.put("/user/disable", {
        userId: selectedUser?._id,
        disabled: disable,
      });
      dispatch(disableUser({ disabled: disable, userId: selectedUser!._id }));
      updateSearchedUsers(disable);
      setSelectedUser((prevState: any) => {
        return { ...prevState, disabled: disable };
      });
      setDisableLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      setDisableLoading(false);
    }
  };

  const updateSearchedUsers = async (value: boolean) => {
    if (isSearching) {
      setSearchUsers((prevAgents: any) => {
        const selectedUserIndex = prevAgents.findIndex(
          (user: TUsers) => user._id === selectedUser?._id
        );
        const updatedUser = {
          ...prevAgents[selectedUserIndex],
          publish: value,
        };
        return [
          ...prevAgents.slice(0, selectedUserIndex),
          updatedUser,
          ...prevAgents.slice(selectedUserIndex + 1),
        ];
      });
    }
  };

  return (
    <Wrapper>
      <nav tw="grid-cols-12 gap-4 grid bg-white py-4 px-8 items-center">
        <Link
          to="/users/add"
          tw="py-2 px-3 rounded-xl bg-cyan-600 text-white text-sm flex items-center font-semibold col-span-1 w-fit"
        >
          ADD NEW
          <BiPlus size={18} tw="ml-1" />
        </Link>
        <input
          tw="rounded-lg w-full col-span-9 drop-shadow-lg bg-purple-800 text-white px-3 h-9"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
        />
        {selectedUser && (
          <Button
            onClick={() =>
              changeDisabledStatus(selectedUser.disabled ? false : true)
            }
            disabled={disableLoading}
            isDisabled={selectedUser.disabled}
          >
            {!selectedUser.disabled ? "Disable?" : "Enable?"}
          </Button>
        )}
      </nav>
      <div tw="p-8">
        {(users[0] || searchUsers) && (
          <table tw="w-full">
            <Thead>
              <Tr>
                <Th>select</Th>
                <Th>name</Th>
                <Th>role</Th>
                <Th>createAt</Th>
                <Th>updatedAt</Th>
                <Th>status</Th>
                <Th>createdBy</Th>
              </Tr>
            </Thead>
            <tbody>
              {(isSearching ? searchUsers! : users).map((user: TUsers) => (
                <Tr key={user._id}>
                  <Td tw="px-1">
                    <input
                      type="checkbox"
                      name="select-property"
                      checked={selectedUser?._id === user?._id}
                      onChange={() => setSelectedUser(user)}
                      tw="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 align-middle mx-auto"
                    />
                  </Td>
                  <Td>{user.name}</Td>
                  <Td tw="capitalize">{user.role}</Td>
                  <Td>
                    {new Date(user.createdAt).toLocaleString("en-US", {
                      timeZone:
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                    })}
                  </Td>
                  <Td>
                    {new Date(user.updatedAt).toLocaleString("en-US", {
                      timeZone:
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                    })}
                  </Td>
                  <Td tw="gap-2 space-y-1">
                    <div tw="flex gap-1">
                      {!user.disabled ? (
                        <Badge tw="border-green-800 bg-green-600 text-green-800 bg-opacity-20">
                          Enabled
                        </Badge>
                      ) : (
                        <Badge tw="border-red-600 bg-red-300 bg-opacity-20 text-red-600">
                          Disabled
                        </Badge>
                      )}
                    </div>
                  </Td>
                  <Td>{user.createdBy.name}</Td>
                </Tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Loader isLoading={isLoading} />
    </Wrapper>
  );
}

const Wrapper = tw.div`w-full bg-[#F4F7FE] h-screen relative`;

const Thead = tw.thead`border-[#F4F7FE] border-[5px] border-solid`;
const Tr = tw.tr`border-[#F4F7FE] border-[5px] border-solid`;
const Th = tw.th`text-left py-3 bg-white px-1 first-of-type:(rounded-tl-2xl rounded-bl-2xl) last-of-type:(rounded-tr-2xl rounded-br-2xl)`;
const Td = tw.td`py-2 px-1 bg-white first-of-type:(rounded-tl-2xl rounded-bl-2xl) last-of-type:(rounded-tr-2xl rounded-br-2xl)`;

const Badge = tw.span`border border-solid rounded-lg  px-2 py-[2px] text-xs font-bold`;

const Button = styled.button`
  ${tw`py-2 px-3 rounded-xl  text-white text-sm flex items-center font-semibold col-span-2 disabled:opacity-60`} ${({
    isDisabled,
  }: {
    isDisabled: boolean;
  }) => (isDisabled ? tw`bg-yellow-600` : tw`bg-green-700`)}
`;

export default Users;
