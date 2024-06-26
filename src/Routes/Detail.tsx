import { useQuery } from "react-query";
import { styled } from "styled-components";
import { IGetMoviesResult, getMovies } from "../api";
import { makeImagePath } from "../util";
import { useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";

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

const Box = styled.div<{ bgPhoto: string }>`
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center;
  height: 200px;
`;

function Detail() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "now"],
    getMovies
  );

  return (
    <Wrapper>
      <h2>title</h2>
      {isLoading ? (
        <Loading>Loading...</Loading>
      ) : (
        <Grid>
          {data?.results.map((movie) => (
            <Box bgPhoto={makeImagePath(movie.backdrop_path)} />
          ))}
        </Grid>
      )}
    </Wrapper>
  );
}

export default Detail;
