import React from "react";
import { TailSpin } from "react-loader-spinner";
import styled from "styled-components";
import tw from "twin.macro";

function Loader({ isLoading }: { isLoading: boolean }) {
  return (
    <Wrapper $isLoading={isLoading}>
      <TailSpin
        radius="0"
        width={100}
        height={100}
        visible={isLoading}
        color="rgb(107 33 168)"
      />
    </Wrapper>
  );
}

const Wrapper = styled.div<{ $isLoading: boolean }>`
  ${tw`absolute left-0 top-0 h-screen w-full bg-white  flex items-center justify-center duration-300 transition-all`} ${({
    $isLoading,
  }) => ($isLoading ? tw`bg-opacity-90 visible ` : tw`bg-opacity-0 invisible `)}
`;

export default Loader;
