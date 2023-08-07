import { styled } from "styled-components";
import { makeImagePath } from "../util";
import { useQuery } from "react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ISearchTv, getTv, popularTv, topTv } from "../api";
import { useRouteMatch } from "react-router-dom";
import Slider from "../components/Slider";
import OverlayTv from "../components/OverlayTv";

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

function Tv() {
  const isOverlay = useRouteMatch("/tv/:tvId");

  const { data: tv, isLoading } = useQuery<ISearchTv>(
    ["tv", "airing_today"],
    getTv
  );

  return (
    <Wrapper>
      {isLoading ? (
        <Loading>
          <span>Loading...</span>
        </Loading>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(tv?.results[0].backdrop_path || "")}>
            <Title>{tv?.results[0].name}</Title>
            <OverView>{tv?.results[0].overview}</OverView>
          </Banner>
          <Slider fun={getTv} title={"현재상영중인 프로그램"} kind="tv" />
          <Slider fun={popularTv} title={"인기있는 프로그램"} kind="tv" />
          <Slider fun={topTv} title={"평점좋은 프로그램"} kind="tv" />

          <AnimatePresence>{isOverlay ? <OverlayTv /> : null}</AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
