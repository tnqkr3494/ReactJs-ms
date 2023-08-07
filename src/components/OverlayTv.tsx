import { motion } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import { styled } from "styled-components";
import { makeImagePath } from "../util";
import { useQuery } from "react-query";
import { ICrew, ITvDetail, getTvDetail, tvCrews } from "../api";

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
  width: 70vw;
  height: 80vh;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow-y: scroll;
`;

const MovieBg = styled.div<{ bgPhoto: string }>`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center top;
  width: 100%;
  height: 400px;
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

const Info = styled.div``;

const Poster = styled.img`
  height: 350px;
  float: left;
  position: relative;
  top: -100px;
  margin-right: 10px;
`;

const Vote = styled.div`
  font-size: 25px;
  font-weight: 600;
  color: ${(prop) => prop.theme.red};
`;

const Release = styled.div`
  font-weight: 600;
`;

const Genre = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 20px;
  span {
    font-weight: 500;
    background-color: blue;
    padding: 10px;
    border-radius: 10px;
  }
`;

const MovieCrews = styled.div`
  padding: 0px 30px;
  display: flex;
  justify-content: space-between;
`;

const Member = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Job = styled.span`
  font-size: 25px;
  font-weight: 500;
`;

const Img = styled.div<{ bgPhoto: string }>`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-image: url(${(props) => props.bgPhoto});
  background-position: center;
  background-size: cover;
  margin: 10px 0px;
`;

const NoImg = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 10px 0px;
  background-color: grey;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  font-size: 20px;
`;

function OverlayTv() {
  const history = useHistory();
  const bigtvMatch = useRouteMatch<{ Id: string }>(`/tv/:Id`);
  const onOverlayClicked = () => {
    history.push("/tv");
  };

  const { data: detail, isLoading } = useQuery<ITvDetail>(
    ["tv", "detail"],
    () => getTvDetail(+bigtvMatch?.params.Id!)
  );

  const { data: crew } = useQuery<ICrew>(["tv", "crew"], () =>
    tvCrews(+bigtvMatch?.params.Id!)
  );

  const producer = crew?.crew.find((member) => member.job === "Producer");

  return (
    <>
      {isLoading ? (
        <Loading>
          <span>Loading...</span>
        </Loading>
      ) : (
        <Wrapper
          onClick={onOverlayClicked}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, type: "tween" }}
        >
          <BigMovie>
            <MovieBg bgPhoto={makeImagePath(detail?.backdrop_path!)}>
              <MovieTitle>{detail?.name}</MovieTitle>
              <span>{detail?.tagline}</span>
              <Genre>
                {detail?.genres.map((genre, index) => {
                  return <span key={index}>{genre.name}</span>;
                })}
              </Genre>
            </MovieBg>
            <MovieDetail>
              <Poster src={makeImagePath(detail?.poster_path!)}></Poster>
              <Info>
                <Release>시즌시작일: {detail?.first_air_date} </Release>
                <Vote>★ {detail?.vote_average.toFixed(1)}</Vote>
                <div>{detail?.overview}</div>
              </Info>
            </MovieDetail>
            <MovieCrews>
              <Member>
                <Job>Producer</Job>
                {producer?.profile_path ? (
                  <Img bgPhoto={makeImagePath(producer?.profile_path!)} />
                ) : (
                  <NoImg>No Img</NoImg>
                )}
                <span>{producer?.name}</span>
              </Member>
              <div style={{ display: "flex" }}>
                {crew?.cast.slice(0, 3).map((member, index) => {
                  return (
                    <Member key={index}>
                      <Job>Actor</Job>
                      {member.profile_path ? (
                        <Img bgPhoto={makeImagePath(member.profile_path)} />
                      ) : (
                        <NoImg>No Img</NoImg>
                      )}
                      <span>{member.name}</span>
                    </Member>
                  );
                })}
              </div>
            </MovieCrews>
          </BigMovie>
        </Wrapper>
      )}
    </>
  );
}

export default OverlayTv;
