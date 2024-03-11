import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import Navbar from "../Navbar";
// import Topbar from "../Topbar";
import { KeywordURL } from "../../Constants/KeywordURL";
import useGetFetch from "../../Hook/useGetFetch";
import LoadingIndicator from "../LoadingIndicator";
import ImportFileModal from "../ImportFileModal";
import AddKeyword from "./AddKeyword";
import LPContainKeyword from "./LPContainKeyword";
import RedirectTo404 from "../RedirectTo404";

const EditKeyword = () => {
  const { keyword_id } = useParams();
  const [keyword, setKeyword] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [onAction, setOnAction] = useState(false);

  const { data, isLoading } = useGetFetch(
    KeywordURL.getEditDetails(keyword_id),
    null,
    onAction
  );

  const [kwDetails, setKWDetails] = useState(null);
  const [lpContainKW, setLpContainKW] = useState(null);
  const [campaigns, setCampaigns] = useState(null);
  const [campaignOpts, setCampaignOpts] = useState(null);

  const toggleAddModal = () => {
    setShowAddModal(!showAddModal);
  };

  const toggleImportModal = () => {
    setShowImportModal(!showImportModal);
  };

  useEffect(() => {
    if (!isLoading && data) {
      setKWDetails(data.keyword);
      setLpContainKW(data.lpContainKW);
      setCampaigns(data.campaignsOpt);
      if (kwDetails) {
        setKeyword(kwDetails.name);
        setUpdatedBy(kwDetails.updated_by.name);
      }
      if (campaigns) {
        const toSelectOption = ({ _id, name }) => ({ label: name, value: _id });
        var campaignsNotLock = campaigns.filter((item) => !item.isLock);
        setCampaignOpts(campaignsNotLock.map(toSelectOption));
      }
    }
  }, [isLoading, data, kwDetails, lpContainKW, campaigns]);

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
            <h5 className="m-0 font-weight-bold text-primary">
              CHI TIẾT TỪ KHOÁ
            </h5>

            <div className="card-body">
              <div className="form-group row">
                <label className="col-sm-3 font-weight-bold col-form-label">
                  Từ khoá <span className="text-danger">*</span>
                </label>
                <div className="col-sm-9">
                  <input
                    className="form-control"
                    id="keyword_name"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    readOnly
                    required
                    placeholder="Nhập từ khoá..."
                  />
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-3 font-weight-bold col-form-label">
                  Người thêm
                </label>
                <div className="col-sm-9">
                  <input
                    className="form-control"
                    value={updatedBy}
                    readOnly
                    required
                  />
                </div>
              </div>

              <div className="card shadow mb-4 mt-5">
                <div className="card-header py-3 ">
                  <div className="float-left text-dark mt-2">
                    <b>--- DANH SÁCH LANDING PAGE CHỨA TỪ KHOÁ ---</b>
                  </div>
                  <div className="float-right">
                    <button
                      className="btn btn-sm btn-primary shadow-sm mr-2"
                      onClick={toggleAddModal}
                    >
                      <i className="fas fa-plus fa-sm text-white-50" /> Thêm mới
                    </button>
                    {/* <button
                      className="btn btn-sm btn-info shadow-sm"
                      onClick={toggleImportModal}
                    >
                      <i className="fas fa-plus fa-sm text-white-50" /> Import
                    </button> */}
                  </div>
                </div>

                {lpContainKW && (
                  <LPContainKeyword
                    lpContainKW={lpContainKW}
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

      {/* Add Keyword Modal */}
      {kwDetails && (
        <AddKeyword
          isOpen={showAddModal}
          toggle={toggleAddModal}
          keyword_id={keyword_id}
          kwDetails={kwDetails}
          campaignOpts={campaignOpts}
          onAction={onAction}
          setOnAction={setOnAction}
        />
      )}

      {/* The Modal import file*/}
      {<ImportFileModal isOpen={showImportModal} toggle={toggleImportModal} />}
    </div>
  );
};

export default EditKeyword;
