import React, { useEffect, useState } from "react";
import tw from "twin.macro";
import { BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../feature/store";
import {
  disableUser,
  enableUser,
  publishAgent as publishAgentRole,
  setUsers,
  unpublishAgent,
} from "../../feature/lists/userListSlice";
import { TUsers } from "../../types/user";
import { toast } from "react-toastify";

function Users() {
  const dispatch: AppDispatch = useDispatch();
  const users = useSelector((state: RootState) => state.userListSlice.users);

  const [selectUserIdx, setSelectUserIdx] = useState<number | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data } = await axiosInstance.get("/user/");
        dispatch(setUsers(data.users));
      } catch (error: any) {
        toast.error(error?.response?.data?.message);
      }
    };
    getUsers();
  }, []);

  const enableUserLogin = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.put("/user/enable", {
        userId: users[selectUserIdx!]?._id,
      });
      dispatch(enableUser(users[selectUserIdx!]?._id as string));
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    }
  };

  const disabledUserLogin = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.put("/user/disable", {
        userId: users[selectUserIdx!]?._id,
      });
      dispatch(disableUser(users[selectUserIdx!]?._id as string));
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    }
  };

  const publishAgent = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.put("/user/publish", {
        userId: users[selectUserIdx!]?._id,
      });
      dispatch(publishAgentRole(users[selectUserIdx!]?._id as string));
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    }
  };

  const unPublishAgent = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.put("/user/unpublish", {
        userId: users[selectUserIdx!]?._id,
      });
      dispatch(unpublishAgent(users[selectUserIdx!]?._id as string));
      setIsLoading(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <div tw="grid-cols-12 gap-4 grid">
        <Link
          to="/users/add"
          tw="py-1 px-3 rounded-3xl bg-blue-500 text-white text-sm flex items-center font-semibold col-span-2 w-fit"
        >
          ADD NEW
          <BiPlus size={18} tw="ml-1" />
        </Link>
        <div tw="col-span-8"></div>
        <div tw="col-span-2 flex gap-1">
          {selectUserIdx !== (null || undefined) && (
            <>
              {users[selectUserIdx!].disabled ? (
                <UserButton
                  tw="bg-green-700 cursor-pointer"
                  onClick={enableUserLogin}
                  disabled={isLoading}
                >
                  enabled?
                </UserButton>
              ) : (
                <UserButton
                  tw="bg-red-600 cursor-pointer"
                  onClick={disabledUserLogin}
                  disabled={isLoading}
                >
                  disabled?
                </UserButton>
              )}
              {users[selectUserIdx!].role === "agent" ? (
                users[selectUserIdx!].publish ? (
                  <UserButton
                    tw="bg-yellow-400 cursor-pointer"
                    onClick={unPublishAgent}
                    disabled={isLoading}
                  >
                    unpublished?
                  </UserButton>
                ) : (
                  <UserButton
                    tw="bg-green-700 cursor-pointer"
                    onClick={publishAgent}
                    disabled={isLoading}
                  >
                    published?
                  </UserButton>
                )
              ) : null}
            </>
          )}
        </div>
      </div>
      {users[0] ? (
        <Table>
          <THead>
            <THeadRow>
              <THeadCell>select</THeadCell>
              <THeadCell>name</THeadCell>
              <THeadCell>role</THeadCell>
              <THeadCell>createAt</THeadCell>
              <THeadCell>updatedAt</THeadCell>
              <THeadCell>status</THeadCell>
              <THeadCell>createdBy</THeadCell>
            </THeadRow>
          </THead>
          <TBody>
            {users.map((user: TUsers, userIdx: number) => (
              <tr key={user._id} tw="odd:bg-gray-200 even:bg-gray-300">
                <TBodyCell tw="px-1">
                  <input
                    type="radio"
                    name="select-user"
                    value={userIdx}
                    tw="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 align-middle mx-auto"
                    onChange={() => setSelectUserIdx(userIdx)}
                  />
                </TBodyCell>
                <TBodyCell>{user.name}</TBodyCell>
                <TBodyCell>{user.role}</TBodyCell>
                <TBodyCell>{new Date(user.createdAt).toDateString()}</TBodyCell>
                <TBodyCell>{new Date(user.updatedAt).toDateString()}</TBodyCell>
                <TBodyCell tw="gap-2 space-y-1">
                  <div tw="flex gap-1">
                    {user.role === "agent" ? (
                      user.publish ? (
                        <Badge tw="bg-green-700">Publish</Badge>
                      ) : (
                        <Badge
                          tw="bg-yellow-400"
                          title="Unpublished agent does not appear on the client side."
                        >
                          unpublished
                        </Badge>
                      )
                    ) : null}
                    {user.disabled ? (
                      <Badge
                        tw="bg-red-600"
                        title="Disabled accounts cannot login to CMS."
                      >
                        Disabled
                      </Badge>
                    ) : (
                      <Badge tw="bg-green-700">Enabled</Badge>
                    )}
                  </div>
                </TBodyCell>
                <TBodyCell>{user.createdBy.name}</TBodyCell>
              </tr>
            ))}
          </TBody>
        </Table>
      ) : (
        "loading..."
      )}
    </Wrapper>
  );
}

const Wrapper = tw.div`w-full bg-[#F4F7FE] h-screen p-8`;

const Table = tw.table`mt-4 w-full max-h-[96%] overflow-auto table-fixed`;
const THead = tw.thead`text-start text-xs uppercase bg-slate-300 rounded mb-4`;
const THeadRow = tw.tr`text-left`;
const THeadCell = tw.th`py-2 px-1`;
const TBody = tw.tbody``;
const TBodyCell = tw.td`py-2`;

const Badge = tw.div`text-white px-3 py-1 font-bold text-sm w-fit rounded-2xl shadow-sm`;

const UserButton = tw.button`text-white px-3 py-1 font-bold text-sm w-fit rounded-2xl shadow-sm disabled:opacity-40`;

export default Users;
