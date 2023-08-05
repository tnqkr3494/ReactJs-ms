import { styled } from "styled-components";
import { makeImagePath } from "../util";
import { useQuery } from "react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  IDetailResult,
  IGetMoviesResult,
  getMovies,
  getMoviesDetail,
} from "../api";
import { useEffect, useState } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import Slider from "../components/Slider";
import Overlay from "../components/Overlay";

const Wrapper = styled.div`
  background-color: black;
`;

const Loading = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  font-weight: 600;
  background-color: black;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 80vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
`;

const Title = styled.h2`
  font-size: 68px;
  font-weight: 300;
  margin-bottom: 20px;
`;

const OverView = styled.p`
  max-width: 500px;
  font-size: 20px;
`;

function Home() {
  const isOverlay = useRouteMatch("/movies/:movieId");

  const { data: movie, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loading>
          <span>Loading...</span>
        </Loading>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(movie?.results[0].backdrop_path || "")}
          >
            <Title>{movie?.results[0].title}</Title>
            <OverView>{movie?.results[0].overview}</OverView>
          </Banner>
          <Slider />
          {isOverlay ? <Overlay /> : null}
        </>
      )}
    </Wrapper>
  );
}

export default Home;
