import { useState } from "react";
import { useParams } from "react-router-dom";
import { DetailLPURL } from "../../Constants/DetailLPURL";
import ImportFileModal from "../ImportFileModal";
import KeywordList from "./KeywordList";
import useGetFetch from "../../Hook/useGetFetch";
import LoadingIndicator from "../LoadingIndicator";
import AddKeyword from "./AddKeyword";
import RedirectTo404 from "../RedirectTo404";

const DetailLandingPage = () => {
  const { lp_id } = useParams();

  const [showImportModal, setShowImportModal] = useState(false);
  const [onAction, setOnAction] = useState(false);

  const { data: detailLPList, isLoading } = useGetFetch(
    DetailLPURL.getAdd(lp_id),
    null,
    onAction
  );

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

          {isLoading ? (
            <LoadingIndicator />
          ) : (
            !detailLPList && <RedirectTo404 />
          )}
          {/* Begin Page Content */}
          <div className="container-fluid">
            {/* Page Heading */}

            <h5 className="font-weight-bold text-primary">
              CHI TIẾT LANDING PAGE ---{" "}
              {detailLPList && (
                <a target="_blank" rel="noreferrer" href={detailLPList.url}>
                  {detailLPList.url}
                </a>
              )}{" "}
              ---
            </h5>

            {detailLPList && !detailLPList.isLock && (
              <div className="d-sm-flex align-items-center justify-content-between mb-4 mt-3">
                <AddKeyword onAction={onAction} setOnAction={setOnAction} />
              </div>
            )}

            <div className="card shadow mb-4 mt-3">
              <div className="card-header py-3 ">
                <div className="float-left text-dark mt-2">
                  <b>--- DANH SÁCH TỪ KHOÁ ---</b>
                </div>
                <div className="float-right">
                  {detailLPList && !detailLPList.isLock && (
                    <button
                      className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm mr-2"
                      onClick={toggleImportModal}
                    >
                      <i className="fas fa-upload fa-sm text-white-50" /> Import
                      từ khoá
                    </button>
                  )}

                  {/* <button className="d-none d-sm-inline-block btn btn-sm btn-success shadow-sm">
                    <i className="fas fa-download fa-sm text-white-50" /> Xuất
                    file
                  </button> */}
                </div>
              </div>

              <div className="card-body ">
                {detailLPList && (
                  <KeywordList
                    detailLPList={detailLPList}
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

export default DetailLandingPage;
