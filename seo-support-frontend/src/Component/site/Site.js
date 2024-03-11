import { useState } from "react";
import { SatSiteURL } from "../../Constants/SatSiteURL";
// import { ScheduleURL } from "../../Constants/ScheduleURL";
import useGetFetch from "../../Hook/useGetFetch";
import LoadingIndicator from "../LoadingIndicator";
import AddSiteModal from "./AddSiteModal";
import SiteList from "./SiteList";

const Site = ({ role }) => {
  const [showAddSite, setShowAddSite] = useState(false);
  const [onAction, setOnAction] = useState(false);

  const { data: satSites, isLoading } = useGetFetch(
    SatSiteURL.getAddSatSite,
    null,
    onAction
  );
  // const { data: postsOfSite, isLoading: isLoading1 } = useGetFetch(
  //   ScheduleURL.countPostsOfSite
  // );

  const toggleAddSite = () => {
    setShowAddSite(!showAddSite);
  };

  return (
    <div id="wrapper" className="content--custom">
      {/* Sidebar */}
      {/* <Navbar /> */}

      {/* Content Wrapper */}
      <div id="content-wrapper" className="d-flex flex-column">
        {/* Main Content */}
        <div id="content">
          {/* <Topbar /> */}

          {isLoading && <LoadingIndicator />}

          <div className="container-fluid">
            {/* Page Heading */}
            <h3 className="font-weight-bold text-center">
              DANH SÁCH SITE VỆ TINH
            </h3>

            <div className="card shadow mb-4">
              {role === "admin" && (
                <div className="card-header py-3">
                  <span
                    className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm float-right"
                    onClick={toggleAddSite}
                  >
                    <i className="fas fa-plus fa-sm text-white-50" /> Thêm mới
                  </span>
                </div>
              )}
              <div className="card-body">
                {satSites && <SiteList satSites={satSites} />}
              </div>
            </div>
          </div>
        </div>
        {/* End of Main Content */}
      </div>
      {/* End of Content Wrapper */}

      <AddSiteModal
        isOpen={showAddSite}
        toggle={toggleAddSite}
        onAction={onAction}
        setOnAction={setOnAction}
      />
    </div>
  );
};

export default Site;
