import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { useQuery } from "react-query";
import { ISearchMovies, ISearchTv, searchMovies, searchTv } from "../api";
import { makeImagePath } from "../util";
import { styled } from "styled-components";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SearchO from "../components/MovieO";
import MovieO from "../components/MovieO";
import TvO from "../components/TvO";

const NoResult = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 68px;
  font-weight: 600;
  padding: 100px;
`;

const Wrapper = styled.div`
  margin-top: 150px;
`;

const SearchInfo = styled.h2`
  font-size: 25px;
  font-weight: 500;
  padding: 20px;
  margin-top: 20px;
`;

const Grid = styled.div`
  padding: 20px;
  margin-bottom: 20px;
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
  const isMovie = useRouteMatch("/search/movie/:Id");
  const isTv = useRouteMatch("/search/tv/:Id");
  const history = useHistory();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data: searchM, refetch: refetchM } = useQuery<ISearchMovies>(
    ["movie", "search"],
    () => searchMovies(keyword!)
  );

  const { data: searchT, refetch: refetchT } = useQuery<ISearchTv>(
    ["tv", "search"],
    () => searchTv(keyword!)
  );

  useEffect(() => {
    refetchM();
    refetchT();
  }, [keyword]);

  const onBoxClicked = (id: number) => {
    history.push(`/search/movie/${id}?keyword=${keyword}`);
  };

  const onBoxClicked2 = (id: number) => {
    history.push(`/search/tv/${id}?keyword=${keyword}`);
  };

  return (
    <Wrapper>
      <SearchInfo>영화 "{keyword}" 검색결과</SearchInfo>
      {searchM?.results.length === 0 ? (
        <NoResult>No Result...</NoResult>
      ) : (
        <Grid>
          {searchM?.results.map((movie) => (
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
        </Grid>
      )}
      <AnimatePresence>
        {isMovie ? <MovieO keyword={keyword!} /> : null}
      </AnimatePresence>
      <hr style={{ margin: "0 20px" }} />
      <SearchInfo>TV "{keyword}" 검색결과</SearchInfo>
      {searchT?.results.length === 0 ? (
        <NoResult>No Result...</NoResult>
      ) : (
        <Grid>
          {searchT?.results.map((Tv) => (
            <Box
              key={Tv.id}
              bgPhoto={makeImagePath(Tv.backdrop_path, "w500")}
              variants={boxVariants}
              initial="normal"
              whileHover="hover"
              transition={{ type: "tween" }}
              onClick={() => onBoxClicked2(Tv.id)}
            >
              <Title>{Tv.name}</Title>
              <Info variants={infoVariants}>
                <Vote>★ {Tv.vote_average.toFixed(1)}</Vote>
                <Release>시즌시작: {Tv.first_air_date}</Release>
              </Info>
            </Box>
          ))}
        </Grid>
      )}
      <AnimatePresence>
        {isTv ? <TvO keyword={keyword!} /> : null}
      </AnimatePresence>
    </Wrapper>
  );
}

export default Search;
