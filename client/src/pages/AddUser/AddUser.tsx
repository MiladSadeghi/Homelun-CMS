import { useEffect, useState } from "react";
import tw from "twin.macro";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserForm } from "../../helper/formSchema";
import { TCreateUser } from "../../types/form";
import { toast } from "react-toastify";
import axiosInstance from "../../services/api";
import { BiLeftArrowAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import ReactSelect from "react-select";

function AddUser() {
  const Roles = [
    { label: "Agent", value: "agent" },
    { label: "Admin", value: "admin" },
    { label: "Super Admin", value: "super_admin" },
  ];

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
    getValues,
    reset,
    setValue,
  } = useForm<TCreateUser>({
    resolver: zodResolver(createUserForm),
  });

  console.log(getValues(), errors);
  const createUserHandler = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post("user", {
        ...getValues(),
      });
      setIsLoading(false);
      toast.success(data.message);
      reset();
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message, { position: "top-right" });
    }
  };

  useEffect(() => {
    console.log(getValues());
  }, [getValues()]);

  return (
    <Wrapper>
      <nav tw="bg-white py-4 px-8 shadow-sm flex items-center">
        <BiLeftArrowAlt
          size={24}
          onClick={() => navigate(-1)}
          tw="mr-2 cursor-pointer"
        />
        <h3 tw="font-bold text-xl ">Add User</h3>
      </nav>
      <div tw="p-8">
        <form onSubmit={handleSubmit(createUserHandler)}>
          <div tw="grid-cols-4 gap-4 grid">
            <Input type="text" placeholder="name" {...register("name")} />
            <Input
              type="email"
              placeholder="email"
              tw="col-span-2"
              {...register("email")}
            />
            <Input
              type="password"
              placeholder="password"
              {...register("password")}
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
            />
          </div>
          <SubmitButton type="submit" disabled={!isValid || isLoading}>
            {isLoading ? "Loading..." : "Create User"}
          </SubmitButton>
        </form>
      </div>
    </Wrapper>
  );
}

const Wrapper = tw.div`w-full bg-[#F4F7FE] h-screen flex flex-col`;

const Input = tw.input`py-2 px-3 rounded-lg`;

const Span = tw.span`py-2 px-1 w-full block rounded-md font-medium`;

const SubmitButton = tw.button`!bg-[#007AFF] text-white py-2 rounded-md font-bold text-base disabled:opacity-50 mt-4 w-48`;

export default AddUser;
