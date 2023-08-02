import { styled } from "styled-components";
import { makeImagePath } from "../util";
import { useQuery } from "react-query";
import { AnimatePresence, motion } from "framer-motion";
import { IGetMoviesResult, getMovies } from "../api";
import { useState } from "react";

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
  height: 100vh;
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
  font-weight: 400;
`;

const OverView = styled.p`
  max-width: 600px;
  font-size: 24px;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  position: absolute;
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
`;

const Box = styled(motion.div)`
  background-color: white;
  height: 200px;
  color: red;
  font-size: 66px;
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  const [index, setIndex] = useState(0);

  const [leaving, setLeaving] = useState(false);

  const toggleLeaving = () => setLeaving((prev) => !prev);

  const nextSlide = () => {
    if (leaving) return;
    toggleLeaving();
    setIndex((prev) => prev + 1);
  };

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
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <OverView>{data?.results[0].overview}</OverView>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                key={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Box key={i}>{i}</Box>
                ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
