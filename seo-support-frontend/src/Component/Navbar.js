import { Link, useLocation } from "react-router-dom";
import { toggleNav } from "../Library/lib";
const Navbar = () => {
  const location = useLocation();

  return (
    <div className="sidebar--custom">
      {/* Overlay */}
      <ul
        className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
        id="accordionSidebar"
      >
        {/* Sidebar - Brand */}
        <Link
          className="sidebar-brand d-flex align-items-center justify-content-center"
          to="/campaign"
        >
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-laugh-wink" />
          </div>
          <div className="sidebar-brand-text mx-3">SEO Support </div>
        </Link>

        {/* Divider */}
        <hr className="sidebar-divider my-0" />

        <li
          className={
            location.pathname.includes("campaign")
              ? "nav-item nav-item--active"
              : "nav-item"
          }
        >
          <span
            className="nav-link collapsed"
            data-toggle="collapse"
            data-target="#collapseUtilities"
            aria-expanded="true"
            aria-controls="collapseUtilities"
          >
            <i className="fas fa-fw fa-wrench"></i>
            <span>Chiến dịch SEO</span>
          </span>
          <div
            id="collapseUtilities"
            className="collapse"
            aria-labelledby="headingUtilities"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <h6 className="collapse-header">Danh sách chiến dịch:</h6>
              <Link
                className={
                  location.pathname === "/campaign"
                    ? "collapse-item active"
                    : "collapse-item "
                }
                to="/campaign"
              >
                Đang hoạt động
              </Link>
              <Link
                className={
                  location.pathname === "/campaign/closed"
                    ? "collapse-item active"
                    : "collapse-item "
                }
                to="/campaign/closed"
              >
                Đã đóng
              </Link>
            </div>
          </div>
        </li>

        {/* Divider */}
        <hr className="sidebar-divider my-0" />
        {/* Nav Item - Từ khoá */}
        <li
          className={
            location.pathname.includes("keyword")
              ? "nav-item nav-item--active"
              : "nav-item"
          }
        >
          <Link className="nav-link" to="/keyword">
            <i className="fas fa-fw fa-tachometer-alt" />
            <span> Từ khoá</span>
          </Link>
        </li>

        {/* Divider */}
        <hr className="sidebar-divider my-0" />
        {/* Nav Item - Vệ tinh*/}
        <li
          className={
            location.pathname.includes("back-link")
              ? "nav-item nav-item--active"
              : "nav-item"
          }
        >
          <Link className="nav-link" to="/back-link">
            <i className="fas fa-fw fa-tachometer-alt" />
            <span> Vệ tinh</span>
          </Link>
        </li>

        {/* Divider */}
        <hr className="sidebar-divider my-0" />
        {/* Nav Item - Bài viết */}
        <li
          className={
            // location.pathname.match(/^(?!.post[-]).*/)
            location.pathname.includes("post")
              ? "nav-item nav-item--active"
              : "nav-item"
          }
        >
          <span
            className="nav-link collapsed"
            data-toggle="collapse"
            data-target="#collapseTwo"
            aria-expanded="true"
            aria-controls="collapseTwo"
          >
            <i className="fas fa-fw fa-cog" />
            <span>Bài viết</span>
          </span>
          <div
            id="collapseTwo"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionSidebar"
          >
            <div className="bg-white py-2 collapse-inner rounded">
              <h6 className="collapse-header">Thể loại: </h6>
              <Link
                className={
                  location.pathname === "/post"
                    ? "collapse-item active"
                    : "collapse-item "
                }
                to="/post"
              >
                Danh sách bài viết
              </Link>
              <Link
                className={
                  location.pathname === "/spin-post"
                    ? "collapse-item active"
                    : "collapse-item "
                }
                to="/spin-post"
              >
                Bài viết tự động
              </Link>
              <Link
                className={
                  location.pathname === "/post/results"
                    ? "collapse-item active"
                    : "collapse-item "
                }
                to="/post/results"
              >
                Kết quả đăng thủ công
              </Link>
            </div>
          </div>
        </li>

        {/* Divider */}
        <hr className="sidebar-divider my-0" />
        {/* Nav Item - Lập lịch SEO */}
        <li
          className={
            location.pathname === "/schedule"
              ? "nav-item nav-item--active"
              : "nav-item"
          }
        >
          <Link className="nav-link" to="/schedule">
            <i className="fas fa-fw fa-tachometer-alt" />
            <span> Lập lịch SEO </span>
          </Link>
        </li>

        {/* Divider */}
        <hr className="sidebar-divider my-0" />
        {/* Nav Item - Lập lịch SEO */}
        <li
          className={
            location.pathname === "/report"
              ? "nav-item nav-item--active"
              : "nav-item"
          }
        >
          <Link className="nav-link" to="/report">
            <i className="fas fa-chart-line"></i>
            <span> Thống kê </span>
          </Link>
        </li>
      </ul>
      <div className="overlay" onClick={toggleNav} />
    </div>

    // <div className="sidebar--custom">
    //   {/* Sidebar */}

    //   {/* End of Sidebar */}
    // </div>
  );
};

export default Navbar;
