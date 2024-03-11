import { useEffect, useState } from "react";
import { authUserURL } from "../Constants/LoginURL";

const AuthUser = () => {
  const [redirect, setRedirect] = useState(false);
  const [authUser, setAuthUser] = useState({});

  useEffect(() => {
    var token = localStorage.getItem("token");

    if (!token) {
      setAuthUser({ code: 400, message: "No token found" });
      setRedirect(true);
      return;
    }
    var myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    fetch(authUserURL, requestOptions)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setAuthUser(data);
        setRedirect(true);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return { authUser, redirect };
};

export default AuthUser;
