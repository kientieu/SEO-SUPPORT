import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div id="wrapper" className="content--custom">
      {/* Content Wrapper */}
      <div id="content-wrapper" className="d-flex flex-column">
        {/* Main Content */}
        <div id="content" style={{ height: "100vh" }}>
          <div className="container-fluid">
            <div className="text-center">
              <div className="error mx-auto" data-text="404">
                404
              </div>
              <p className="lead text-gray-800 mb-5">
                Đường dẫn bạn truy cập không tồn tại...
              </p>
              <Link to="/">&larr; Trở về trang chủ</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
