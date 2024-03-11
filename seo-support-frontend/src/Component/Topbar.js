import { useHistory } from "react-router-dom";
import { toggleNav } from "../Library/lib";
const Topbar = () => {
  const history = useHistory();
  var user = JSON.parse(localStorage.getItem("user"));

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    history.push("/login");
  };

  return (
    user && (
      <div className="topbar--custom">
        {/* Topbar */}
        <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
          <button
            id="sidebarToggleTop"
            className="btn btn-link d-md-none rounded-circle mr-3 toggle-button--custom"
            onClick={toggleNav}
          >
            <i className="fa fa-bars"></i>
          </button>
          {/* Topbar Navbar */}
          <ul className="navbar-nav ml-auto">
            {/* Nav Item - Alerts */}
            <li
              className="nav-item dropdown no-arrow mx-1"
              id="notify-dropdown--container"
              onClick={(e) => {
                document
                  .querySelector("#notify-dropdown")
                  .classList.toggle("show");
                document
                  .querySelector("#notify-dropdown--container")
                  .classList.toggle("show");
              }}
            >
              <span
                className="nav-link dropdown-toggle "
                id="alertsDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="fas fa-bell fa-fw" />
                {/* Counter - Alerts */}
                <span className="badge badge-danger badge-counter">3+</span>
              </span>
              {/* Dropdown - Alerts */}
              <div
                className="dropdown-list dropdown-menu  shadow animated--grow-in"
                aria-labelledby="alertsDropdown"
                id="notify-dropdown"
                style={{ right: "0", left: "unset" }}
              >
                <h6 className="dropdown-header">Alerts Center</h6>
                <span className="dropdown-item d-flex align-items-center">
                  <div className="mr-3">
                    <div className="icon-circle bg-primary">
                      <i className="fas fa-file-alt text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="small text-gray-500">December 12, 2019</div>
                    <span className="font-weight-bold">
                      A new monthly report is ready to download!
                    </span>
                  </div>
                </span>
                <span className="dropdown-item d-flex align-items-center">
                  <div className="mr-3">
                    <div className="icon-circle bg-success">
                      <i className="fas fa-donate text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="small text-gray-500">December 7, 2019</div>
                    $290.29 has been deposited into your account!
                  </div>
                </span>
                <span className="dropdown-item d-flex align-items-center">
                  <div className="mr-3">
                    <div className="icon-circle bg-warning">
                      <i className="fas fa-exclamation-triangle text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="small text-gray-500">December 2, 2019</div>
                    Spending Alert: We've noticed unusually high spending for
                    your account.
                  </div>
                </span>
                <span className="dropdown-item text-center small text-gray-500">
                  Show All Alerts
                </span>
              </div>
            </li>

            <div className="topbar-divider d-none d-sm-block" />
            {/* Nav Item - User Information */}
            <li
              className="nav-item dropdown no-arrow"
              id="user-dropdown-container"
              onClick={() => {
                document
                  .querySelector("#user-dropdown")
                  .classList.toggle("show");
                document
                  .querySelector("#user-dropdown-container")
                  .classList.toggle("show");
              }}
            >
              <span
                className="nav-link dropdown-toggle"
                id="userDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="mr-2 d-none d-lg-inline text-gray-600 small">
                  {user.name}
                </span>
                <img
                  className="img-profile rounded-circle"
                  src="https://e7.pngegg.com/pngimages/550/997/png-clipart-user-icon-foreigners-avatar-child-face.png"
                  /*src={user.avatar}*/
                  alt="User avatar"
                />
              </span>
              {/* Dropdown - User Information */}
              <div
                className="dropdown-menu  shadow animated--grow-in"
                aria-labelledby="userDropdown"
                id="user-dropdown"
                style={{ left: "unset", right: "0" }}
              >
                <span className="dropdown-item">
                  <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400" />
                  Profile
                </span>
                <span className="dropdown-item">
                  <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400" />
                  Settings
                </span>
                <span className="dropdown-item">
                  <i className="fas fa-list fa-sm fa-fw mr-2 text-gray-400" />
                  Activity Log
                </span>
                <div className="dropdown-divider" />
                <span
                  className="dropdown-item"
                  data-toggle="modal"
                  data-target="#logoutModal"
                  onClick={() => logOut()}
                >
                  <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
                  Logout
                </span>
              </div>
            </li>
          </ul>
        </nav>
        {/* End of Topbar */}
      </div>
    )
  );
};

export default Topbar;
