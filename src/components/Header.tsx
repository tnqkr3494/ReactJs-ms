import React, { useState } from "react";
import { styled } from "styled-components";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useAnimation,
  AnimatePresence,
} from "framer-motion";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { useForm } from "react-hook-form";

const Nav = styled(motion.nav)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  color: white;
  position: fixed;
  top: 0;
  z-index: 999;
`;

const NavList = styled(motion.div)`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.black.darker};
  width: 200px;
  padding: 20px;
  gap: 15px;
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled(motion.li)`
  margin-right: 30px;
  position: relative;
`;

const Logo = styled(motion.svg)`
  margin-right: 40px;
  width: 95px;
  height: 25px;
  fill: ${(props) => props.theme.red};
  path {
    stroke-width: 6px;
    stroke: white;
  }
`;

const Circle = styled(motion.span)`
  background-color: ${(props) => props.theme.red};
  border-radius: 50%;
  width: 5px;
  height: 5px;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: -5px;
`;

const Search = styled.form`
  display: flex;
  align-items: center;
  position: relative;
  svg {
    height: 25px;
  }
`;

const Input = styled(motion.input)`
  transform-origin: right center;
  padding: 5px 10px;
  padding-left: 40px;
  font-size: 16px;
  position: absolute;
  right: 0px;
  z-index: -1;
  background-color: transparent;
  color: white;
  border: 1px solid ${(props) => props.theme.white.lighter};
`;

const logoVariants = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    fillOpacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
    },
  },
};

const navVariants = {
  start: {
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  scrolled: {
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
};

const navListVariants = {
  start: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

interface IForm {
  keyword: string;
}

function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleHoverStart = () => {
    setIsHovered(true);
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
  };
  const homeMatch = useRouteMatch("/");
  const tvMatch = useRouteMatch("/tv");
  const { scrollYProgress } = useScroll();
  const navAnimation = useAnimation();
  const inputAnimation = useAnimation();

  useMotionValueEvent(scrollYProgress, "change", (y) => {
    if (y < 0.1) navAnimation.start("start");
    else navAnimation.start("scrolled");
  });

  const toggleSearch = () => {
    if (searchOpen) {
      inputAnimation.start({ scaleX: 0 });
    } else {
      inputAnimation.start({ scaleX: 1 });
    }
    setSearchOpen((prev) => !prev);
  };

  const { register, handleSubmit } = useForm<IForm>();
  const history = useHistory();

  const onValid = (data: IForm) => {
    history.push(`/search?keyword=${data.keyword}`);
  };

  return (
    <>
      <Nav variants={navVariants} animate={navAnimation} initial="start">
        <Items>
          <Logo
            variants={logoVariants}
            whileHover="active"
            animate="normal"
            xmlns="http://www.w3.org/2000/svg"
            width="1024"
            height="276.742"
            viewBox="0 0 1024 276.742"
          >
            <motion.path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
          </Logo>
          <Item onMouseEnter={handleHoverStart} onMouseLeave={handleHoverEnd}>
            <Link to="/">
              Movie
              {homeMatch?.isExact ? <Circle layoutId="circle" /> : null}
            </Link>
            <AnimatePresence>
              {isHovered ? (
                <NavList
                  variants={navListVariants}
                  initial="start"
                  animate="animate"
                  exit="exit"
                >
                  <Link to="/detail/nowplaying">
                    <span>현재상영중인 영화</span>
                  </Link>
                  <span>인기있는 영화</span>
                  <span>평점높은 영화</span>
                  <span>개봉예정인 영화</span>
                </NavList>
              ) : null}
            </AnimatePresence>
          </Item>
          <Item>
            <Link to="/tv">
              TV
              {tvMatch ? <Circle layoutId="circle" /> : null}
            </Link>
          </Item>
        </Items>
        <Search onSubmit={handleSubmit(onValid)}>
          <motion.svg
            onClick={toggleSearch}
            animate={{ x: searchOpen ? -180 : 0 }}
            transition={{ type: "linear" }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>
          <Input
            {...register("keyword", { required: true, minLength: 2 })}
            animate={inputAnimation}
            initial={{ scaleX: 0 }}
            transition={{ type: "linear" }}
          />
        </Search>
      </Nav>
    </>
  );
}

export default Header;
