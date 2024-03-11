const Register = () => {
  return (
    <div className="container">
      <div className="card o-hidden border-0 shadow-lg my-5">
        <div className="card-body p-0">
          {/* Nested Row within Card Body */}
          <div className="row">
            <div className="col-lg-5 d-none d-lg-block bg-register-image" />
            <div className="col-lg-7">
              <div className="p-5">
                <div className="text-center">
                  <h1 className="h4 text-gray-900 mb-4">
                    Tạo tài khoản SEO Support!
                  </h1>
                </div>
                <form className="user">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control form-control-user"
                      id="exampleFirstName"
                      placeholder="Tên tài khoản"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control form-control-user"
                      id="exampleInputEmail"
                      placeholder="Email"
                    />
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-6 mb-3 mb-sm-0">
                      <input
                        type="password"
                        className="form-control form-control-user"
                        id="exampleInputPassword"
                        placeholder="Mật khẩu"
                      />
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="password"
                        className="form-control form-control-user"
                        id="exampleRepeatPassword"
                        placeholder="Nhập lại mật khaiả"
                      />
                    </div>
                  </div>
                  <a
                    href="login.html"
                    className="btn btn-primary btn-user btn-block"
                  >
                    Đăng ký
                  </a>
                  <hr />
                  <a
                    href="index.html"
                    className="btn btn-google btn-user btn-block"
                  >
                    <i className="fab fa-google fa-fw" /> Đăng ký bằng tài khoản
                    Google
                  </a>
                </form>
                <hr />
                <div className="text-center">
                  <a className="small" href="forgot-password.html">
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="text-center">
                  <a className="small" href="login.html">
                    Bạn đã có tài khoản rồi?
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
