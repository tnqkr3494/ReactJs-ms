import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { useQuery } from "react-query";
import { ISearchMovies, searchMovies } from "../api";
import { makeImagePath } from "../util";
import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchO from "../components/SearchO";

const Loading = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  font-weight: 600;
  background-color: black;
`;

const Wrapper = styled.div`
  margin: 150px 60px 0px 90px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 50px 10px;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  height: 200px;
  color: red;
  font-size: 66px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-position: center;
  background-size: cover;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 10px;
`;

const Info = styled(motion.div)`
  opacity: 0;
  background-color: ${(props) => props.theme.black.lighter};
  padding: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  font-size: 14px;
  font-weight: 500;
  color: white;
  text-align: center;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: white;
  max-width: 200px;
`;

const Vote = styled.div`
  font-size: 18px;
  color: ${(prop) => prop.theme.red};
`;

const Release = styled.div``;

const boxVariants = {
  normal: {
    scale: 1,
  },

  hover: {
    scale: 1.3,
    y: -60,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

function Search() {
  const isOverlay = useRouteMatch("/search/movie/:Id");
  const history = useHistory();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data, isLoading, refetch } = useQuery<ISearchMovies>(
    ["movie", "search"],
    () => searchMovies(keyword!)
  );
  useEffect(() => {
    refetch();
  }, [keyword]);

  const onBoxClicked = (id: number) => {
    history.push(`/search/movie/${id}?keyword=${keyword}`);
  };

  return (
    <Wrapper>
      <h2>영화 {keyword} 검색결과</h2>
      {isLoading ? (
        <Loading>Loading...</Loading>
      ) : (
        <Grid>
          {data?.results.map((movie) => (
            <Box
              key={movie.id}
              bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
              variants={boxVariants}
              initial="normal"
              whileHover="hover"
              transition={{ type: "tween" }}
              onClick={() => onBoxClicked(movie.id)}
            >
              <Title>{movie.title}</Title>
              <Info variants={infoVariants}>
                <Vote>★ {movie.vote_average.toFixed(1)}</Vote>
                <Release>개봉일: {movie.release_date}</Release>
              </Info>
            </Box>
          ))}
          <AnimatePresence>
            {isOverlay ? <SearchO query="movie" keyword={keyword!} /> : null}
          </AnimatePresence>
        </Grid>
      )}
    </Wrapper>
  );
}

export default Search;
