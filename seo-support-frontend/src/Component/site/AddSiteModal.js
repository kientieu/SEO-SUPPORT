import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { SatSiteURL } from "../../Constants/SatSiteURL";
import usePostFetch from "../../Hook/usePostFetch";
import { siteLvOpts } from "../../Constants/SiteLvConst";
import Select from "react-select";

const AddSiteModal = ({ isOpen, toggle, onAction, setOnAction }) => {
  const [isPending, setIsPending] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [siteName, setSiteName] = useState("");
  const [siteLevel, setSiteLevel] = useState("");
  const [siteHasApi, setSiteHasApi] = useState(false);
  const [inputParamsKey, setInputParamsKey] = useState([""]);
  const [inputParamsVal, setInputParamsVal] = useState([""]);

  const customSelectStyles = {
    // Fix the overlapping problem of the Select component
    menu: (provided) => ({ ...provided, zIndex: 9999 }),
  };

  const handleNewParam = () => {
    var updatedInputKey = [...inputParamsKey];
    updatedInputKey.push("");
    setInputParamsKey(updatedInputKey);

    var updatedInputVal = [...inputParamsVal];
    updatedInputVal.push("");
    setInputParamsVal(updatedInputVal);
  };

  const handleDelParam = () => {
    var updatedInputKey = [...inputParamsKey];
    updatedInputKey.pop("");
    setInputParamsKey(updatedInputKey);

    var updatedInputVal = [...inputParamsVal];
    updatedInputVal.pop("");
    setInputParamsVal(updatedInputVal);
  };

  const handleAddInputKey = (e, index) => {
    var updatedInputKey = [...inputParamsKey];
    updatedInputKey[index] = e.target.value;
    setInputParamsKey(updatedInputKey);
  };

  const handleAddInputVal = (e, index) => {
    var updatedInputVal = [...inputParamsVal];
    updatedInputVal[index] = e.target.value;
    setInputParamsVal(updatedInputVal);
  };

  const AddSite = async (e) => {
    e.preventDefault();
    var inputParams = {};
    for (var i = 0; i < inputParamsKey.length; i++) {
      inputParams[`${inputParamsKey[i]}`] = inputParamsVal[i];
    }
    // console.log(inputParams);

    var postData = {
      url: inputUrl,
      name: siteName,
      hasApi: siteHasApi,
      level: siteLevel.value,
    };

    if (siteHasApi) {
      postData["params"] = JSON.stringify(inputParams);
    }

    const result = await usePostFetch(
      SatSiteURL.getAddSatSite,
      "POST",
      null,
      postData,
      onAction,
      setOnAction,
      setIsPending,
      toggle
    );
    if (result) {
      setInputUrl("");
      setSiteName("");
      setSiteLevel("");
      setInputParamsKey([""]);
      setInputParamsVal([""]);
    }
  };

  return (
    <Modal show={isOpen} size="lg" centered>
      <form onSubmit={(e) => AddSite(e)}>
        <Modal.Header>
          <h6 className="m-0 font-weight-bold text-primary">
            Thêm loại site vệ tinh
          </h6>
          <button type="button" className="close" onClick={toggle}>
            ×
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group row">
            <label className="col-sm-3 font-weight-bold col-form-label">
              URL <span className="text-danger">*</span>{" "}
            </label>
            <div className="col-sm-9">
              <input
                className="form-control"
                required
                maxLength={60}
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 font-weight-bold col-form-label">
              Tên site <span className="text-danger">*</span>{" "}
            </label>
            <div className="col-sm-9">
              <input
                className="form-control"
                required
                maxLength={40}
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 font-weight-bold col-form-label">
              Level <span className="text-danger">*</span>{" "}
            </label>
            <div className="col-sm-9">
              <Select
                options={siteLvOpts}
                classNamePrefix="select"
                value={siteLevel}
                onChange={(option, e) => setSiteLevel(option)}
                styles={customSelectStyles}
              />
            </div>
          </div>
          <div className="form-group row">
            <p className="col-3 font-weight-bold col-form-label">
              Site có hỗ trợ Api:
            </p>
            <div className="col-9 text-center col-form-label">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={siteHasApi}
                  onChange={() => setSiteHasApi(!siteHasApi)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
          {siteHasApi &&
            inputParamsKey.map((item, index) => {
              return (
                <div className="form-group row" key={index}>
                  <div className="col-3">
                    <label className="font-weight-bold">
                      Param {index + 1}
                    </label>
                    <input
                      className="form-control"
                      maxLength={20}
                      required
                      value={item}
                      onChange={(e) => handleAddInputKey(e, index)}
                    />
                  </div>
                  <div className="col-8">
                    <label className="font-weight-bold">
                      Miêu tả cho param
                    </label>
                    <textarea
                      className="form-control"
                      rows={2}
                      maxLength={60}
                      required
                      value={inputParamsVal[index]}
                      onChange={(e) => handleAddInputVal(e, index)}
                    />
                  </div>
                  <div className="col-1">
                    <i
                      className="fas fa-plus-circle fa-lg"
                      style={{ color: "green" }}
                      onClick={handleNewParam}
                    ></i>
                    {index !== 0 && (
                      <i
                        className="fas fa-minus-circle fa-lg"
                        style={{ color: "black" }}
                        onClick={handleDelParam}
                      ></i>
                    )}
                  </div>
                </div>
              );
            })}
        </Modal.Body>
        <Modal.Footer>
          {isPending ? (
            <>
              <Button variant="secondary" disabled>
                Đóng
              </Button>
              <Button type="button" variant="primary" disabled>
                Đang Lưu...
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={toggle}>
                Đóng
              </Button>
              <Button type="submit" variant="primary">
                Lưu
              </Button>
            </>
          )}
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AddSiteModal;
