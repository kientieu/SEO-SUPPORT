import { useState } from "react";
import Failure from "../alert/Failure.js";
import { LoginURL } from "../../Constants/LoginURL.js";
import { Redirect } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(false);

  const setParams = (event) => {
    if (isError) {
      setIsError(false);
      setMessage("");
    }
    if (event.target.name === "email") setEmail(event.target.value);
    if (event.target.name === "password") setPassword(event.target.value);
  };

  const validate = () => {
    if (email === "" || password === "") {
      setIsError(true);
      setMessage("Vui lòng nhập đầy đủ thông tin");
      return false;
    }
    return true;
  };

  const login = () => {
    if (!validate()) return;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("email", email);
    urlencoded.append("password", password);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
      redirect: "follow",
    };

    fetch(LoginURL.normalLogin, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        if (data.code !== 200) {
          let message = data.message;
          if (Array.isArray(data.message)) {
            message = data.message[0];
          }
          setMessage(message);
          return setIsError(true);
        }
        localStorage.setItem("token", "Bearer " + data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            avatar: data.user.avatar,
          })
        );
        setIsLogin(true);
      })
      .catch((error) => console.log("error", error));
  };

  const fetchGoogleAuthUser = () => {
    var requestOptions = {
      method: "GET",
      credentials: "include",
    };

    return fetch(LoginURL.googleAuth, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        return data;
      })
      .catch((error) => console.log("Error:", error));
  };

  const loginWithGoogle = () => {
    let timer = null;
    const googleLoginURL = LoginURL.googleLogin;
    const newWindow = window.open(
      googleLoginURL,
      "_blank",
      "width=500, height=600"
    );

    if (newWindow) {
      timer = setInterval(() => {
        if (newWindow.closed) {
          fetchGoogleAuthUser().then((data) => {
            // console.log(data);
            if (data && data.code !== 200) {
              setMessage(data.message);
              return setIsError(true);
            }
            localStorage.setItem("token", "Bearer " + data.token);
            localStorage.setItem(
              "user",
              JSON.stringify({
                name: data.user.name,
                email: data.user.email,
                role: data.user.role,
                avatar: data.user.avatar,
              })
            );
            setIsLogin(true);
          });

          if (timer) {
            clearInterval(timer);
          }
        }
      }, 500);
    }
  };

  if (isLogin) {
    return <Redirect to={"/campaign"} />;
  }

  return (
    <div className="container">
      {/* Outer Row */}
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 col-md-9">
          <div className="card-login o-hidden border-0 shadow-lg my-5">
            <div className="card-body p-0">
              {/* Nested Row within Card Body */}
              <div className="row">
                <div className="col-lg-6 d-none d-lg-block bg-login-image" />
                <div className="col-lg-6">
                  <div className="p-5">
                    <div className="text-center">
                      <h1 className="h4 text-gray-900 mb-4">
                        Welcome to <b>SEO SUPPORT!</b>{" "}
                      </h1>
                    </div>
                    <form className="user">
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control form-control-user"
                          id="exampleInputEmail"
                          placeholder="Email..."
                          name="email"
                          onChange={setParams}
                        />
                      </div>

                      <div className="form-group">
                        <input
                          type="password"
                          className="form-control form-control-user"
                          id="exampleInputPassword"
                          placeholder="Mật khẩu"
                          name="password"
                          onChange={setParams}
                        />
                      </div>

                      {isError && <Failure message={message} />}

                      <button
                        type="button"
                        className="btn btn-primary btn-user btn-block"
                        onClick={login}
                      >
                        Đăng nhập
                      </button>
                    </form>

                    <hr />
                    <button
                      className="btn btn-google btn-user btn-block"
                      onClick={loginWithGoogle}
                    >
                      <i className="fab fa-google fa-fw" /> Đăng nhập bằng tài
                      khoản Google
                    </button>

                    {/* <hr />
                    <div className="text-center">
                      <a className="small" href="forgot-password.html">
                        Quên mật khẩu?
                      </a>
                    </div>
                    <div className="text-center">
                      <a className="small" href="login.html">
                        Bạn chưa có tài khoản ?
                      </a>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
