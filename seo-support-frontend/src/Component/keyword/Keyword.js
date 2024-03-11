import { useState } from "react";
import { KeywordURL } from "../../Constants/KeywordURL";
import { CampaignURL } from "../../Constants/CampaignURL";
// import Navbar from "../Navbar";
// import Topbar from "../Topbar";
import ImportFileModal from "../ImportFileModal";
import AddKeyword from "./AddKeyword";
import KeywordList from "./KeywordList";
import useGetFetch from "../../Hook/useGetFetch";
import LoadingIndicator from "../LoadingIndicator";

const Keyword = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const [onAction, setOnAction] = useState(false);

  const { data: keywords, isLoading } = useGetFetch(
    KeywordURL.getAdd,
    null,
    onAction
  );
  const { data: campaigns } = useGetFetch(CampaignURL.getAdd, null, onAction);

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
          {isLoading && <LoadingIndicator />}

          <div className="container-fluid">
            {/* Page Heading */}
            <h3 className="font-weight-bold text-center">DANH SÁCH TỪ KHOÁ</h3>

            <div className="card shadow mb-4">
              <div className="card-header py-3 ">
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
              </div>
              <div className="card-body">
                {keywords && (
                  <KeywordList
                    keywords={keywords}
                    onAction={onAction}
                    setOnAction={setOnAction}
                  />
                )}
              </div>

              {/* Add Keyword Modal */}
              {campaigns && (
                <AddKeyword
                  isOpen={showAddModal}
                  toggle={toggleAddModal}
                  campaignOpts={campaigns.map(({ _id, name }) => ({
                    label: name,
                    value: _id,
                  }))}
                  onAction={onAction}
                  setOnAction={setOnAction}
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
          </div>
        </div>
        {/* End of Main Content */}
      </div>
      {/* End of Content Wrapper */}
    </div>
  );
};

export default Keyword;
