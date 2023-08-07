import { styled } from "styled-components";
import { makeImagePath } from "../util";
import { useQuery } from "react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  IGetMoviesResult,
  getMovies,
  popularMovies,
  topMovies,
  upComingMovies,
} from "../api";
import { useRouteMatch } from "react-router-dom";
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
          <Slider fun={getMovies} title={"현재상영중인 영화"} kind="movies" />
          <Slider fun={popularMovies} title={"인기있는 영화"} kind="movies" />
          <Slider fun={topMovies} title={"평점좋은 영화"} kind="movies" />
          <Slider
            fun={upComingMovies}
            title={"개봉예정인 영화"}
            kind="movies"
            movie
          />
          <AnimatePresence>{isOverlay ? <Overlay /> : null}</AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
