import { useState, useEffect } from "react";
import { CampaignURL } from "../../Constants/CampaignURL";
import AddModal from "./AddModal";
import ImportFileModal from "../ImportFileModal";
import CampaignList from "./CampaignList";
import useGetFetch from "../../Hook/useGetFetch";
import PagePagination from "../pagination/PagePagination";
import LoadingIndicator from "../LoadingIndicator";
import { itemsPerPage } from "../../Constants/Pagination";

const Campaign = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [onAction, setOnAction] = useState(false);
  const { data: campaigns, isLoading } = useGetFetch(
    CampaignURL.getAdd,
    null,
    onAction
  );

  const [activePage, setActivePage] = useState(1);
  const [activeData, setActiveData] = useState([]);

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  const toggleImportModal = () => {
    setShowImportModal(!showImportModal);
  };

  useEffect(() => {
    if (campaigns) {
      const data = campaigns.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
      );
      setActiveData(data);
    }
  }, [campaigns, activePage]);

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
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
              <h3 className="font-weight-bold">CHIẾN DỊCH</h3>
              <div>
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
            </div>
            {/* Content Row */}
            <div className="row">
              {/* Chiến dịch */}
              {campaigns && (
                <CampaignList
                  campaigns={campaigns}
                  onAction={onAction}
                  setOnAction={setOnAction}
                />
              )}

              {/* Add Campaign Modal */}
              {
                <AddModal
                  isOpen={showAddModal}
                  toggle={toggleAddModal}
                  onAction={onAction}
                  setOnAction={setOnAction}
                />
              }

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

            {/* Pagination Row */}
            {campaigns && (
              <PagePagination
                data={campaigns}
                activePage={activePage}
                setActivePage={setActivePage}
                setOnAction={setOnAction}
              />
            )}
          </div>
        </div>
        {/* End of Main Content */}
      </div>
      {/* End of Content Wrapper */}
    </div>
  );
};

export default Campaign;
