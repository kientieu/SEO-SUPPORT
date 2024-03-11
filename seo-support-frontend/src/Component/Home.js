import { Redirect } from "react-router-dom";
import AuthUser from "./AuthUser";

const Home = () => {
  const { authUser, redirect } = AuthUser();

  console.log(redirect);
  return (
    <>
      {redirect ? (
        authUser.code === 200 ? (
          <Redirect to={"/campaign"} />
        ) : (
          <Redirect to={"/login"} />
        )
      ) : null}
    </>
  );
};

export default Home;
