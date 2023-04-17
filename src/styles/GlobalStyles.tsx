import React from "react";
import { createGlobalStyle } from "styled-components";
import { GlobalStyles as BaseStyles } from "twin.macro";

const CustomStyles = createGlobalStyle`
*,
*::before,
*::after {
  box-sizing: border-box;
  transition: all .25s;
  font-family: Mulish;
}
path,
svg,
i::before,
i::after {
  transition: initial;
}
html {
  scroll-behavior: smooth;
}
body {
  min-height: 100vh;
  text-rendering: optimizeSpeed;
  line-height: 1.5;
  position: relative; // For the footer
}
body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd,
ul,
ol {
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
}
button,
input {
  border: none;
  outline: none;
  cursor: pointer;
  font: inherit;
}
ul {
  list-style: none;
}
img,
picture {
  max-width: 100%;
  display: block;
}
`;

const GlobalStyles = (): JSX.Element => (
  <>
    <BaseStyles />
    <CustomStyles />
  </>
);

export default GlobalStyles;
