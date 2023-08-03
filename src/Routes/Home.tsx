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

const Slider = styled.div`
  position: relative;
  height: 50vh;
`;

const SlderTitle = styled.h2`
  font-weight: 800;
  margin-bottom: 20px;
  font-size: 28px;
  padding-left: 12px;
`;

const Row = styled(motion.div)`
  position: absolute;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  padding: 0 5px;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  height: 200px;
  color: red;
  font-size: 66px;
  background-image: url(${(props) => props.bgPhoto});
  background-position: center;
  background-size: cover;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
  cursor: pointer;
`;

const Info = styled(motion.div)`
  opacity: 0;
  background-color: ${(props) => props.theme.black.lighter};
  padding: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 0;
  font-size: 18px;
  color: white;
  text-align: center;
`;

const Overlay = styled(motion.div)`
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

const SliderBtn = styled(motion.div)`
  position: absolute;
  top: 120px;
  background-color: ${(props) => props.theme.black.lighter};
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.7;
  cursor: pointer;
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

// Variants

const rowVariants = {
  hidden: (isBack: boolean) => {
    return { x: isBack ? -window.outerWidth - 5 : window.outerWidth + 5 };
  },
  visible: {
    x: 0,
  },
  exit: (isBack: boolean) => {
    return { x: isBack ? window.outerWidth + 5 : -window.outerWidth - 5 };
  },
};

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

const offset = 6;

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const [isBack, setIsBack] = useState(false);
  const { data: movie, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const [index, setIndex] = useState(0);

  const [leaving, setLeaving] = useState(false);

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const nextSlide = () => {
    if (movie) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = movie.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      setIsBack(false);
    }
  };

  const prevSlide = () => {
    if (movie) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = movie.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      setIsBack(true);
    }
  };

  const onBoxClicked = (id: number) => {
    history.push(`movies/${id}`);
  };

  const onOverlayClicked = () => {
    history.push("/");
  };

  const { data: detail, refetch: refetchDetail } = useQuery<IDetailResult>(
    ["movie", "detail"],
    () => getMoviesDetail(+bigMovieMatch?.params.movieId!)
  );
  useEffect(() => {
    if (bigMovieMatch) {
      refetchDetail();
    }
  }, [bigMovieMatch]);

  return (
    <Wrapper>
      {isLoading ? (
        <Loading>
          <span>Loading...</span>
        </Loading>
      ) : (
        <>
          <Banner
            onClick={nextSlide}
            bgPhoto={makeImagePath(movie?.results[0].backdrop_path || "")}
          >
            <Title>{movie?.results[0].title}</Title>
            <OverView>{movie?.results[0].overview}</OverView>
          </Banner>
          <Slider>
            <SlderTitle>Now Playing</SlderTitle>
            <AnimatePresence
              initial={false}
              onExitComplete={toggleLeaving}
              custom={isBack}
            >
              <Row
                key={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                whileHover="hover"
                custom={isBack}
              >
                {movie?.results
                  .slice(1)
                  .slice(index * offset, index * offset + offset)
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      onClick={() => onBoxClicked(movie.id)}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <SliderBtn onClick={prevSlide}>1</SliderBtn>
            <SliderBtn style={{ right: 0 }} onClick={nextSlide}>
              2
            </SliderBtn>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
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
                </Overlay>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
