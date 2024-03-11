import { Redirect, Route, useLocation } from "react-router-dom";
import AuthUser from "./AuthUser";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const location = useLocation();
  const { authUser, redirect } = AuthUser();

  return (
    <>
      {redirect ? (
        <Route {...rest}>
          {authUser.code === 200 ? (
            <Component role={authUser.data.role} />
          ) : (
            <Redirect to={{ pathname: "/login", state: { from: location } }} />
          )}
        </Route>
      ) : null}
    </>
  );
};

export default PrivateRoute;
