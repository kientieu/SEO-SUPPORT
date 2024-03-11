import { Redirect, useLocation } from "react-router-dom";

const RedirectTo404 = () => {
  const location = useLocation();

  return (
    <Redirect
      to={{
        pathname: "/error",
        state: { from: location.pathname },
      }}
    />
  );
};

export default RedirectTo404;
