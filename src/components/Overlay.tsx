import { motion, AnimatePresence } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import { styled } from "styled-components";
import { makeImagePath } from "../util";
import { useQuery } from "react-query";
import { IDetailResult, getMoviesDetail } from "../api";

const Loading = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  font-weight: 600;
  background-color: black;
`;

const Wrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 50vw;
  height: 80vh;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
`;

const MovieBg = styled.div<{ bgPhoto: string }>`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center top;
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  justify-content: center;
`;

const MovieTitle = styled.h2`
  font-weight: 800;
  font-size: 30px;
`;

const MovieDetail = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  padding: 20px;
`;

function Overlay() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const onOverlayClicked = () => {
    history.push("/");
  };

  const { data: detail, isLoading } = useQuery<IDetailResult>(
    ["movie", "detail"],
    () => getMoviesDetail(+bigMovieMatch?.params.movieId!)
  );

  return (
    <>
      {isLoading ? (
        <Loading>
          <span>Loading...</span>
        </Loading>
      ) : (
        <AnimatePresence>
          <Wrapper
            onClick={onOverlayClicked}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, type: "tween" }}
          >
            <BigMovie>
              <MovieBg bgPhoto={makeImagePath(detail?.backdrop_path!)}>
                <MovieTitle>{detail?.title}</MovieTitle>
                <span>{detail?.tagline}</span>
              </MovieBg>
              <MovieDetail>
                <span>{detail?.overview}</span>
              </MovieDetail>
            </BigMovie>
          </Wrapper>
        </AnimatePresence>
      )}
    </>
  );
}

export default Overlay;
