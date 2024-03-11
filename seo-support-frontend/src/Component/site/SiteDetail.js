import { useState } from "react";
import { useParams } from "react-router-dom";
import useGetFetch from "../../Hook/useGetFetch";
import { SatSiteURL } from "../../Constants/SatSiteURL";
import AddSiteDetail from "./AddSiteDetail";
import SiteDetailList from "./SiteDetailList";
import LoadingIndicator from "../LoadingIndicator";
import RedirectTo404 from "../RedirectTo404";

const SiteDetail = () => {
  const { sat_site_id } = useParams();
  const [showAddModal, setShowAddModal] = useState(false);
  const [onAction, setOnAction] = useState(false);

  const { data, isLoading } = useGetFetch(
    SatSiteURL.getAddSiteDetail(sat_site_id),
    null,
    onAction
  );

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
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

          {isLoading ? <LoadingIndicator /> : !data && <RedirectTo404 />}

          <div className="container-fluid">
            {/* Page Heading */}
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
              <h5 className="mb-2 font-weight-bold text-primary">
                CHI TIẾT SITE VỆ TINH --- {data && data.satSite.name} ---
              </h5>
              {data && data.satSite.has_api && (
                <div>
                  <button
                    className="btn btn-sm btn-primary shadow-sm mr-2"
                    onClick={toggleAddModal}
                  >
                    <i className="fas fa-plus fa-sm text-white-50" /> Thêm mới
                  </button>
                </div>
              )}
            </div>
            {/* Content Row */}
            <div className="row">
              {data && (
                <AddSiteDetail
                  isOpen={showAddModal}
                  toggle={toggleAddModal}
                  onAction={onAction}
                  setOnAction={setOnAction}
                  data={data}
                />
              )}
            </div>

            <div>
              {data && (
                <SiteDetailList
                  siteDetail={data.siteDetail}
                  siteAcc={data.siteAcc}
                  onAction={onAction}
                  setOnAction={setOnAction}
                />
              )}
            </div>
          </div>
        </div>
        {/* End of Main Content */}
      </div>
      {/* End of Content Wrapper */}
    </div>
  );
};

export default SiteDetail;
