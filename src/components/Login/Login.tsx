import React, { useState } from "react";
import tw from "twin.macro";
import Logo from "../../helper/Logo";
import { login, loginForm } from "../../helper/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { userLoggedIn } from "../../feature/user/userSlicer";

function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { isValid },
    getValues,
    reset,
  } = useForm<login>({
    resolver: zodResolver(loginForm),
  });

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post("/user/login", {
        email: getValues().email,
        password: getValues().password,
      });
      setIsLoading(false);
      localStorage.setItem("kq_c", data.refreshToken);
      dispatch(
        userLoggedIn({
          accessToken: data.accessToken,
          isAuthenticated: true,
        })
      );
      reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message, { position: "top-left" });
      setIsLoading(false);
      reset();
    }
  };

  return (
    <Main>
      <LoginBar style={{ backdropFilter: "blur(20px)" }}>
        <div tw="mb-12">
          <Logo color="dark" />
        </div>
        <p tw="font-bold text-xl mb-6">Nice to see you again</p>
        <form tw="flex flex-col" onSubmit={handleSubmit(handleLogin)}>
          <Label htmlFor="email-login">Email</Label>
          <Input type="text" id="email-login" {...register("email")} />
          <Label htmlFor="password-login">Password</Label>
          <Input
            type="password"
            id="password-login"
            tw="mb-8"
            {...register("password")}
          />
          <SubmitButton type="submit" disabled={!isValid || isLoading}>
            {isLoading ? "Loading..." : "Sign In"}
          </SubmitButton>
        </form>
      </LoginBar>
    </Main>
  );
}

const Main = tw.div`w-full h-screen bg-[url('src/assets/login-bg.jpg')] bg-cover bg-center`;
const LoginBar = tw.div`h-screen bg-[#fff] shadow-lg bg-opacity-40 bg-clip-padding w-[456px] p-12 ml-auto border-[1px] border-white flex flex-col`;

const Label = tw.label`mx-4 text-[16px] text-black mb-2`;
const Input = tw.input`mb-4 h-12 bg-[#F2F2F2] rounded-[6px] shadow-sm px-4`;

const SubmitButton = tw.button`!bg-[#007AFF] text-white h-10 rounded-md font-bold text-base disabled:opacity-50`;

export default Login;
