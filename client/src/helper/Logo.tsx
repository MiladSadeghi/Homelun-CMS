import React from "react";
import tw, { styled } from "twin.macro";

function Logo({ color }: { color: "light" | "dark" }) {
  return (
    <H5 color={color}>
      Homelun <Span>&#9632;</Span>
    </H5>
  );
}

const H5 = styled.h5<{ color: string }>`
  ${tw`text-2xl font-bold text-white leading-8`} ${({
    color,
  }: {
    color: string;
  }) => (color === "white" ? tw`text-white` : tw`text-[rgba(44, 60, 77, 1)]`)}
`;
const Span = tw.span`text-[rgba(255, 102, 83, 1)] text-[8px] -ml-[5px]`;

export default Logo;
