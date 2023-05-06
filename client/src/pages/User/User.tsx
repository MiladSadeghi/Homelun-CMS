import { useEffect, useRef, useState } from "react";
import tw from "twin.macro";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserForm } from "../../helper/formSchema";
import { TCreateUser } from "../../types/form";
import { toast } from "react-toastify";
import axiosInstance from "../../services/api";
import { BiLeftArrowAlt } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import ReactSelect from "react-select";
import Loader from "../../components/Loader/Loader";
import { TUsers } from "../../types/user";

function User() {
  const Roles = [
    { label: "Agent", value: "agent" },
    { label: "Admin", value: "admin" },
    { label: "Super Admin", value: "super_admin" },
  ];

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { userId } = useParams();
  const [isFetchLoading, setIsFetchLoading] = useState<boolean>(false);
  const [user, setUser] = useState<TUsers | null>();
  const roleRef: any = useRef();

  const {
    register,
    handleSubmit,
    formState: { isValid },
    getValues,
    reset,
    setValue,
  } = useForm<TCreateUser>({
    resolver: zodResolver(createUserForm),
  });

  useEffect(() => {
    const getUser = async () => {
      if (userId) {
        try {
          setIsLoading(true);
          const { data } = await axiosInstance.get(`user/${userId}`);
          setValue("email", data.user.email);
          setValue("name", data.user.name);
          setValue("role", data.user.role);
          roleRef!.current!.setValue({
            label: data.user.role[0].toUpperCase() + data.user.role.slice(1),
            value: data.user.role.toLowerCase().replace(/ /g, "_"),
          });
          setUser(data.user);
        } catch (error: any) {
          toast.error(error.response.data.message);
          navigate(-1);
        } finally {
          setIsLoading(false);
        }
      }
    };
    getUser();
  }, []);

  const createUserHandler = async () => {
    try {
      setIsFetchLoading(true);
      const { data } = await axiosInstance.post("user", {
        ...getValues(),
      });
      setIsFetchLoading(false);
      toast.success(data.message);
      reset();
    } catch (error: any) {
      setIsFetchLoading(false);
      toast.error(error?.response?.data?.message);
    }
  };

  const updateObjects = (obj1: any, obj2: any) => {
    const updatedObject = Object.keys(obj1).reduce(
      (acc, key) =>
        obj1[key] === obj2[key] ? acc : { ...acc, [key]: obj2[key] },
      {}
    );
    return updatedObject;
  };

  const updateUserHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsFetchLoading(true);
      const body = updateObjects(
        {
          name: user!.name,
          email: user!.email,
          role: user!.role,
          password: "",
        },
        getValues()
      );
      const { data } = await axiosInstance.post(`user/${userId}`, body);
      toast.success(data.message);
      navigate(-1);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsFetchLoading(false);
    }
  };

  return (
    <Wrapper>
      <nav tw="bg-white py-4 px-8 shadow-sm flex items-center">
        <BiLeftArrowAlt
          size={24}
          onClick={() => navigate(-1)}
          tw="mr-2 cursor-pointer"
        />
        <h3 tw="font-bold text-xl ">{userId ? "Edit User" : "Add User"}</h3>
      </nav>
      <div tw="p-8">
        <form
          onSubmit={
            userId ? updateUserHandler : handleSubmit(createUserHandler)
          }
        >
          <div tw="grid-cols-4 gap-4 grid">
            <Input
              type="text"
              placeholder="name"
              {...register("name")}
              autoComplete="off"
            />
            <Input
              type="email"
              placeholder="email"
              tw="col-span-2"
              {...register("email")}
              autoComplete="off"
            />
            <Input
              type="password"
              placeholder="password"
              {...register("password")}
              autoComplete="off"
            />
            <ReactSelect
              tw="col-span-1 h-full hover:border-none"
              isSearchable={false}
              onChange={(e: any) => setValue("role", e.value)}
              styles={{
                control: (baseStyles, state) => ({
                  ...baseStyles,
                  height: "100%",
                  border: "1px solid rgb(209 213 219)",
                  boxShadow: state.isFocused ? "none" : "none",
                  outline: "none",
                  "&:hover": { border: "1px solid rgb(209 213 219)" },
                }),
              }}
              defaultValue={Roles[0]}
              placeholder="Select Role..."
              options={Roles}
              ref={roleRef}
            />
          </div>
          {}
          <SubmitButton
            type="submit"
            disabled={userId ? isFetchLoading : !isValid || isFetchLoading}
          >
            {userId ? "Edit" : "Create"}
          </SubmitButton>
        </form>
      </div>
      <Loader isLoading={isLoading} />
    </Wrapper>
  );
}

const Wrapper = tw.div`w-full bg-[#F4F7FE] h-screen flex flex-col relative`;

const Input = tw.input`py-2 px-3 rounded-lg`;

const SubmitButton = tw.button`!bg-[#007AFF] text-white py-2 rounded-md font-bold text-base disabled:opacity-50 mt-4 w-48`;

export default User;
