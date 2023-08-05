import React from "react";
import { BrowserRouter, Route, Router, Switch } from "react-router-dom";
import { styled } from "styled-components";
import Header from "./components/Header";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Home from "./Routes/Home";
import Detail from "./Routes/Detail";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/tv">
          <Tv />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route path="/detail/:kind">
          <Detail />
        </Route>
        <Route path={["/", "/movies/:movieId"]}>
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
