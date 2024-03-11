const LoginFail = () => {
  return (
    <div
      style={{
        backgroundColor: "white",
        color: "green",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <p className="text-center" style={{ alignSelf: "center" }}>
        Đăng nhập với Google thất bại. Vui lòng thử lại sau!!!
      </p>
    </div>
  );
};

export default LoginFail;