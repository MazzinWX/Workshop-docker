import styled from "@emotion/styled";
import React from "react";
import CatSwiper from "./CatSwiper";

const Header = styled("h1")`
  font-family: sans-serif;
`;

const App = () => (
  <div>
    <Header data-testid="header">🐳🔥🐳 Docker UI Demo 🔥🐳🔥</Header>
    <CatSwiper />
  </div>
);

export default App;
