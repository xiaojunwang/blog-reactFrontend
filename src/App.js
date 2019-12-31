import React from "react";
import { BrowserRouter } from "react-router-dom"; // will know all the routes requets
import MainRouter from "./MainRouter";

const App = () => (
  // all routes in MainRouter happens in the same BrowserRouter environment, so no page refresh
  <BrowserRouter>
    <MainRouter />
  </BrowserRouter>
);

export default App;
