import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { styled } from "styled-components";
import { IGetMoviesResult } from "../api";
import { useHistory } from "react-router-dom";
import { makeImagePath } from "../util";

const Wrapper = styled.div`
  position: relative;
  height: 50vh;
`;

const SlderTitle = styled.h2`
  font-weight: 800;
  margin-bottom: 20px;
  font-size: 28px;
  padding-left: 12px;
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

const offset = 6;

function Slider({ fun, title }: any) {
  const history = useHistory();
  const [isBack, setIsBack] = useState(false);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const { data: movie } = useQuery<IGetMoviesResult>(["movies", title], fun);

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
  return (
    <Wrapper>
      <SlderTitle>{title}</SlderTitle>
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
    </Wrapper>
  );
}

export default Slider;
