import React, { useEffect, useState } from "react";
import tw from "twin.macro";
import axiosInstance from "../../services/api";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { editProfileForm } from "../../helper/formSchema";
import { TAgentForm } from "../../types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { isProfileCompleted } from "../../feature/user/userSlice";

function Profile() {
  const [isLoading, setIsLoading] = useState<boolean[]>([false, false]);
  const dispatch = useDispatch();
  useEffect(() => {
    const getAgentProfile = async () => {
      try {
        setIsLoading((prevState) => [...prevState, (prevState[0] = true)]);
        const {
          data: { profile },
        } = await axiosInstance.get("agent");
        setValue("about", profile.about);
        setValue("cover", profile.cover);
        setValue("field", profile.field);
        setValue("name", profile.name);
        setValue("phoneNumber", profile.phoneNumber);
        setValue("social.instagram", profile?.social?.instagram);
        setValue("social.linkedin", profile?.social?.linkedin);
        setValue("social.twitter", profile?.social?.twitter);
        dispatch(isProfileCompleted(true));
        setIsLoading((prevState) => [...prevState, (prevState[0] = false)]);
      } catch (error: any) {
        toast.error(
          error.response.status !== 422 && error.response.data.message
        );
        dispatch(isProfileCompleted(false));
        setIsLoading((prevState) => [...prevState, (prevState[0] = false)]);
      }
    };
    getAgentProfile();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { isValid },
    getValues,
    setValue,
  } = useForm<TAgentForm>({
    resolver: zodResolver(editProfileForm),
  });

  const updateProfile = async () => {
    try {
      setIsLoading((prevState) => [...prevState, (prevState[1] = true)]);
      const { data } = await axiosInstance.post("agent", {
        ...getValues(),
      });
      dispatch(isProfileCompleted(true));
      toast.success(data.message);
      setIsLoading((prevState) => [...prevState, (prevState[1] = false)]);
    } catch (error: any) {
      toast.error(error.response.data.message);
      dispatch(isProfileCompleted(false));
      setIsLoading((prevState) => [...prevState, (prevState[1] = false)]);
    }
  };

  if (isLoading[0]) return <>Loading...</>;
  return (
    <Wrapper>
      <h1 tw="font-bold text-3xl mb-7">Profile</h1>
      <form tw="grid-cols-3 gap-4 grid" onSubmit={handleSubmit(updateProfile)}>
        <Input type="text" placeholder="name" {...register("name")} />
        <Input type="text" placeholder="field" {...register("field")} />
        <Input
          type="type"
          placeholder="phone number"
          {...register("phoneNumber")}
        />
        <Input
          type="text"
          placeholder="instagram ID"
          {...register("social.instagram")}
        />
        <Input
          type="text"
          placeholder="linkedin ID"
          {...register("social.linkedin")}
        />
        <Input
          type="text"
          placeholder="twitter ID"
          {...register("social.twitter")}
        />
        <Input type="text" placeholder="cover" {...register("cover")} />
        <Textarea placeholder="About" {...register("about")} rows={6} />
        <Button type="submit" disabled={!isValid || isLoading[1]}>
          Add
        </Button>
      </form>
    </Wrapper>
  );
}

const Wrapper = tw.div`w-full bg-[#F4F7FE] h-screen p-8`;
const Input = tw.input`py-2 px-3 rounded-lg border-gray-300 border-solid border h-fit`;
const Textarea = tw.textarea`py-2 px-3 rounded-lg border-gray-300 border-solid border outline-none resize-none`;
const Button = tw.button`rounded-md !bg-teal-700 text-white text-sm flex items-center font-semibold py-2 px-2 col-span-1 w-full h-fit justify-self-end justify-center col-start-3 row-start-4 disabled:opacity-60`;

export default Profile;
