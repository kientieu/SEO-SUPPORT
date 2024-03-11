import { useCallback, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useLocation, useParams } from "react-router-dom";
import { ImportFileConstant } from "../Constants/ImportFileConstant";
import { CampaignURL } from "../Constants/CampaignURL";
import { LPURL } from "../Constants/LPURL";
import { DetailLPURL } from "../Constants/DetailLPURL";
import { KeywordURL } from "../Constants/KeywordURL";
import LoadingIndicator from "./LoadingIndicator";
import ShowToast from "../Services/ShowToast";
import ImportFileResult from "./ImportFileResult";
import { useEffect } from "react";

const ImportFileModal = ({ isOpen, toggle, onAction, setOnAction }) => {
  const location = useLocation();
  const { campaign_id, lp_id } = useParams();

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [template, setTemplate] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState(null);

  const checkPathForTemplate = useCallback(() => {
    // console.log(location);
    let pathname = location.pathname;
    if (pathname.match(/^\/campaign$/)) {
      return ImportFileConstant.campaignTemplate;
    } else if (pathname.match(/^\/detail-campaign/)) {
      return ImportFileConstant.detailCampaignTemplate;
    } else if (
      pathname.match(/^\/detail-lp/) ||
      pathname.match(/^\/keyword$/)
    ) {
      return ImportFileConstant.keywordTemplate;
    }
  }, [location]);

  const checkPathForFetch = useCallback(() => {
    let pathname = location.pathname;
    if (pathname.match(/^\/campaign$/)) {
      return CampaignURL.addExcel;
    } else if (pathname.match(/^\/detail-campaign/)) {
      return LPURL.addExcel(campaign_id);
    } else if (pathname.match(/^\/detail-lp/)) {
      return DetailLPURL.addExcel(lp_id);
    } else if (pathname.match(/^\/keyword$/)) {
      return KeywordURL.addExcel;
    }
  }, [location, campaign_id, lp_id]);

  useEffect(() => {
    if (isOpen) {
      setTemplate(checkPathForTemplate());
    }
  }, [isOpen, checkPathForTemplate]);

  const handleSelectedFile = (e) => {
    setSelectedFile(e.target.files[0]);
    setSelectedFileName(e.target.files[0].name);
  };

  const ImportFile = async (e) => {
    e.preventDefault();

    // console.log(selectedFile);
    var token = localStorage.getItem("token");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    const formData = new FormData();
    formData.append("file", selectedFile);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
    };

    try {
      setIsPending(true);
      const res = await fetch(checkPathForFetch(), requestOptions);
      const data = await res.json();
      setIsPending && setIsPending(false);
      console.log(data);
      if (data) {
        if (data.code === 200) {
          ShowToast.handleSuccessToast(data.message);
          setOnAction && setOnAction(!onAction);
          setResult(data);
          setSelectedFileName("");
        } else {
          ShowToast.handleErrorToast(data.message);
        }
      } else {
        ShowToast.handleErrorToast("Đã có lỗi xảy ra. Vui lòng thử lại sau");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      {isPending && <LoadingIndicator />}

      {!result && (
        <Modal show={isOpen} size="lg" centered>
          <form encType="multipart/form-data" onSubmit={(e) => ImportFile(e)}>
            <Modal.Header>
              <h6 className="m-0 font-weight-bold text-primary">
                Thêm bằng file
              </h6>
              <button type="button" className="close" onClick={toggle}>
                ×
              </button>
            </Modal.Header>
            <Modal.Body>
              <div className="form-group row">
                <label className="col-sm-4 font-weight-bold col-form-label">
                  {" "}
                  Tệp muốn thêm{" "}
                </label>
                <div className="input-group ml-2 mr-2">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Upload</span>
                  </div>
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="inputFile"
                      name="file"
                      accept=".xlsx,.xls"
                      style={{ display: "none" }}
                      onChange={(e) => handleSelectedFile(e)}
                    />
                    <label className="custom-file-label" htmlFor="inputFile">
                      {selectedFileName !== ""
                        ? selectedFileName
                        : "Chọn file excel"}
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-group text-center">
                <button
                  type="button"
                  className="btn btn-info"
                  disabled={!template ? true : false}
                >
                  <a
                    href={template}
                    download
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    Tải file mẫu
                  </a>
                </button>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" variant="primary">
                Thêm
              </Button>
              <Button variant="secondary" onClick={toggle}>
                Đóng
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      )}

      {result && (
        <ImportFileResult
          isOpen={isOpen}
          toggle={toggle}
          result={result}
          setResult={setResult}
        />
      )}
    </>
  );
};

export default ImportFileModal;
