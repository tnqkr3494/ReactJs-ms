import { motion } from "framer-motion";
import { useHistory, useRouteMatch } from "react-router-dom";
import { styled } from "styled-components";
import { makeImagePath } from "../util";
import { useQuery } from "react-query";
import { ICrew, IDetailResult, getMoviesDetail, movieCrews } from "../api";

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
  overflow-y: scroll;
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

const Vote = styled.div`
  font-size: 25px;
  color: ${(prop) => prop.theme.red};
`;

const Release = styled.div``;

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

  const { data: crew } = useQuery<ICrew>(["movie", "crew"], () =>
    movieCrews(+bigMovieMatch?.params.movieId!)
  );

  console.log(crew);

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
              <MovieTitle>{detail?.title}</MovieTitle>
              <span>{detail?.tagline}</span>
              <Genre>
                {detail?.genres.map((genre, index) => {
                  return <span key={index}>{genre.name}</span>;
                })}
              </Genre>
            </MovieBg>
            <MovieDetail>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Release>개봉일 : {detail?.release_date}</Release>
                <Vote>평점 : {detail?.vote_average.toFixed(1)}</Vote>
              </div>

              <div>{detail?.overview}</div>
            </MovieDetail>
            <MovieCrews>
              <Member>
                <Job>Producer</Job>
                <Img bgPhoto={makeImagePath(producer?.profile_path!)} />
                <span>{producer?.name}</span>
              </Member>
              <div style={{ display: "flex" }}>
                {crew?.cast.slice(0, 3).map((member, index) => {
                  return (
                    <Member key={index}>
                      <Job>Actor</Job>
                      <Img bgPhoto={makeImagePath(member.profile_path)} />
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

export default Overlay;
