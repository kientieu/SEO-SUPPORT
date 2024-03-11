import { useEffect } from "react";

const LoginSuccess = () => {
  useEffect(() => {
    setTimeout(() => {
      window.close();
    }, 2000);
  }, []);

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
      <p className="text-center" style={{alignSelf: "center"}}>
        Đăng nhập với Google thành công. Vui lòng chờ trong chốc lát để trang
        web điều hướng!!!
      </p>
    </div>
  );
};

export default LoginSuccess;
