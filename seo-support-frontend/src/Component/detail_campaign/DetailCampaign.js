import { useState } from "react";
import { useParams } from "react-router-dom";
import { LPURL } from "../../Constants/LPURL";
// import Navbar from "../Navbar";
// import Topbar from "../Topbar";
import AddModal from "../detail_campaign/AddModal";
import LandingPageList from "./LandingPageList";
import useGetFetch from "../../Hook/useGetFetch";
import LoadingIndicator from "../LoadingIndicator";
import ImportFileModal from "../ImportFileModal";
import RedirectTo404 from "../RedirectTo404";

const DetailCampaign = () => {
  var { campaign_id } = useParams();
  // console.log(campaign_id);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [onAction, setOnAction] = useState(false);

  const { data, isLoading } = useGetFetch(
    LPURL.getAdd(campaign_id),
    null,
    onAction
  );

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };
  const toggleImportModal = () => {
    setShowImportModal(!showImportModal);
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
            <h1 className="h3 mb-2 text-gray-800 text-center">
              {data && data.campaign.name}
            </h1>
            <p className="mb-4 text-center">
              Nhấn vào đây để chuyển hướng sang trang web
              <a
                target="_blank"
                rel="noreferrer"
                href={data && data.campaign.url}
              >
                {" "}
                {data && data.campaign.url}
              </a>
            </p>

            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <h6 className="m-1 font-weight-bold text-primary float-left">
                  Danh sách các Landing page
                </h6>
                {data && !data.campaign.isLock && (
                  <div className="float-right">
                    <button
                      className="btn btn-sm btn-primary shadow-sm mr-2"
                      onClick={toggleAddModal}
                    >
                      <i className="fas fa-plus fa-sm text-white-50" /> Thêm mới
                    </button>

                    <button
                      className="btn btn-sm btn-info shadow-sm"
                      onClick={toggleImportModal}
                    >
                      <i className="fas fa-plus fa-sm text-white-50" /> Import
                    </button>
                  </div>
                )}
              </div>

              <div className="card-body" id="landing-page-list">
                {data && (
                  <LandingPageList
                    landingPages={data.landingPages}
                    campaign={data.campaign}
                    onAction={onAction}
                    setOnAction={setOnAction}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* End of Main Content */}
      </div>
      {/* End of Content Wrapper */}
      {data && (
        <AddModal
          isOpen={showAddModal}
          toggle={toggleAddModal}
          onAction={onAction}
          setOnAction={setOnAction}
          campaign={data.campaign}
        />
      )}

      {/* The Modal import file*/}
      {
        <ImportFileModal
          isOpen={showImportModal}
          toggle={toggleImportModal}
          onAction={onAction}
          setOnAction={setOnAction}
        />
      }
    </div>
  );
};

export default DetailCampaign;
