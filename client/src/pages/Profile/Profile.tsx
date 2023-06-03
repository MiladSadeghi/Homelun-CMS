import React, { useEffect, useState } from "react";
import tw from "twin.macro";
import axiosInstance from "../../services/api";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { editProfileForm } from "../../helper/formSchema";
import { TAgentForm } from "../../types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { isProfileCompleted } from "../../feature/user/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import { BiLeftArrowAlt } from "react-icons/bi";
import { RootState } from "../../feature/store";

function Profile() {
  const [isLoading, setIsLoading] = useState<boolean[]>([false, false]);
  const dispatch = useDispatch();
  const { agentSlug } = useParams();
  const navigate = useNavigate();
  const profile = useSelector(
    (state: RootState) => state.userSlice.agentProfile
  );

  const {
    register,
    handleSubmit,
    formState: { isValid },
    getValues,
    setValue,
  } = useForm<TAgentForm>({
    resolver: zodResolver(editProfileForm),
  });

  useEffect(() => {
    setValue("about", profile!.about);
    setValue("cover", profile!.cover);
    setValue("field", profile!.field);
    setValue("name", profile!.name);
    setValue("phoneNumber", profile!.phoneNumber);
    setValue("social.instagram", profile?.social?.instagram);
    setValue("social.linkedin", profile?.social?.linkedin);
    setValue("social.twitter", profile?.social?.twitter);
  }, []);

  const updateProfile = async () => {
    try {
      const { data } = await axiosInstance.post("agent/profile", {
        ...getValues(),
        ...(agentSlug && { agentSlug }),
      });
      dispatch(isProfileCompleted({ status: false }));
      toast.success(data.message);
      setIsLoading((prevState) => [...prevState, (prevState[1] = false)]);
    } catch (error: any) {
      toast.error(error.response.data.message);
      dispatch(isProfileCompleted({ status: false }));
      setIsLoading((prevState) => [...prevState, (prevState[1] = false)]);
    }
  };

  if (isLoading[0]) return <>Loading...</>;
  return (
    <Wrapper>
      <nav tw="flex gap-4 bg-white py-4 px-8 items-center">
        <BiLeftArrowAlt
          size={24}
          onClick={() => navigate(-1)}
          tw="mr-2 cursor-pointer"
        />
        <h3 tw="font-bold text-xl ">
          {agentSlug ? "Edit Profile" : "Profile"}
        </h3>
      </nav>
      <form
        tw="grid-cols-3 gap-4 grid p-8"
        onSubmit={handleSubmit(updateProfile)}
      >
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
          Edit
        </Button>
      </form>
    </Wrapper>
  );
}

const Wrapper = tw.div`w-full bg-[#F4F7FE] h-screen relative col-span-10`;
const Input = tw.input`py-2 px-3 rounded-lg border-gray-300 border-solid border h-fit`;
const Textarea = tw.textarea`py-2 px-3 rounded-lg border-gray-300 border-solid border outline-none resize-none`;
const Button = tw.button`rounded-md !bg-teal-700 text-white text-sm flex items-center font-semibold py-2 px-2 col-span-1 w-full h-fit justify-self-end justify-center col-start-3 row-start-4 disabled:opacity-60`;

export default Profile;
