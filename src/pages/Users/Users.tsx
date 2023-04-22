import React, { useEffect } from "react";
import tw from "twin.macro";
import { BiPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../feature/store";
import { setUsers } from "../../feature/lists/userListSlice";
import { TUsers } from "../../types/user";

function Users() {
  const dispatch: AppDispatch = useDispatch();
  const users = useSelector((state: RootState) => state.userListSlice.users);

  useEffect(() => {
    const getUsers = async () => {
      const { data } = await axiosInstance.get("/user/");
      dispatch(setUsers(data.users));
    };
    getUsers();
  }, []);

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
            {users.map((user: TUsers) => (
              <tr key={user._id} tw="odd:bg-gray-200 even:bg-gray-300">
                <TBodyCell tw="px-1">
                  <input
                    id="checkbox-all-search"
                    type="checkbox"
                    name="select-user"
                    tw="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded align-middle mx-auto"
                  />
                </TBodyCell>
                <TBodyCell>{user.name}</TBodyCell>
                <TBodyCell>{user.role}</TBodyCell>
                <TBodyCell>{new Date(user.createdAt).toDateString()}</TBodyCell>
                <TBodyCell>{new Date(user.updatedAt).toDateString()}</TBodyCell>
                <TBodyCell tw="gap-2 space-y-1">
                  {user.disabled && <Badge tw="bg-red-600">Disabled</Badge>}{" "}
                  {user.publish ? (
                    <Badge tw="bg-green-700">Publish</Badge>
                  ) : (
                    <Badge tw="bg-yellow-400">unpublished</Badge>
                  )}
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

const Table = tw.table`mt-4 w-full max-h-[96%] overflow-auto`;
const THead = tw.thead`text-start text-xs uppercase bg-slate-300 rounded mb-4`;
const THeadRow = tw.tr`text-left`;
const THeadCell = tw.th`py-2 px-1 `;
const TBody = tw.tbody``;
const TBodyCell = tw.td`py-2`;

const Badge = tw.div`text-white px-3 py-1 font-bold text-sm w-fit rounded-2xl shadow-sm`;

export default Users;
