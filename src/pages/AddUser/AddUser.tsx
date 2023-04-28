import { Listbox, Transition } from "@headlessui/react";
import { useState } from "react";
import tw from "twin.macro";
import { HiOutlineChevronDown } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserForm } from "../../helper/formSchema";
import { TCreateUser } from "../../types/form";
import { toast } from "react-toastify";
import axiosInstance from "../../services/api";

function AddUser() {
  const Roles = [
    { role: "Agent", value: "agent" },
    { role: "Admin", value: "admin" },
    { role: "Super Admin", value: "super_admin" },
  ];

  const [selected, setSelected] = useState(Roles[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { isValid },
    getValues,
    reset,
  } = useForm<TCreateUser>({
    resolver: zodResolver(createUserForm),
  });

  const createUserHandler = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post("user", {
        ...getValues(),
        role: selected.value,
      });
      setIsLoading(false);
      toast.success(data.message);
      reset();
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error?.response?.data?.message, { position: "top-right" });
    }
  };

  return (
    <Wrapper>
      <h1 tw="font-bold text-3xl mb-7">Add New User</h1>
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
          <Listbox value={selected} onChange={setSelected}>
            <div tw="relative mt-1">
              <Listbox.Button
                tw="relative w-full cursor-default rounded-lg !bg-white py-2 pl-3 pr-10 text-left font-bold"
                placeholder="Role"
              >
                <span>{selected.role}</span>
                <span tw="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <HiOutlineChevronDown
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Listbox.Options tw="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg text-lg z-10">
                  {Roles.map((role, roleIdx) => (
                    <Listbox.Option
                      key={roleIdx}
                      value={role}
                      tw="py-2 px-3 text-base w-full"
                    >
                      {({ selected: selectedOption }: any) => (
                        <>
                          {selectedOption ? (
                            <Span tw="bg-[#F4F7FE]">{role.role}</Span>
                          ) : (
                            <Span tw="">{role.role}</Span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
        <SubmitButton type="submit" disabled={!isValid || isLoading}>
          {isLoading ? "Loading..." : "Create User"}
        </SubmitButton>
      </form>
    </Wrapper>
  );
}

const Wrapper = tw.div`w-full bg-[#F4F7FE] h-screen p-8 flex flex-col`;

const Input = tw.input`py-2 px-3 rounded-lg`;

const Span = tw.span`py-2 px-1 w-full block rounded-md font-medium`;

const SubmitButton = tw.button`!bg-[#007AFF] text-white py-2 rounded-md font-bold text-base disabled:opacity-50 mt-4 w-48`;

export default AddUser;
