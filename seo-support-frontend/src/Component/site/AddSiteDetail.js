import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { SatSiteURL } from "../../Constants/SatSiteURL";
import usePostFetch from "../../Hook/usePostFetch";

const AddSiteDetail = ({ isOpen, toggle, onAction, setOnAction, data }) => {
  const { sat_site_id } = useParams();
  const [isPending, setIsPending] = useState(false);
  const [siteParamsKey, setSiteParamsKey] = useState(null);
  const [siteParamsVal, setSiteParamsVal] = useState(null);
  const [inputUrl, setInputUrl] = useState("");
  const [inputParamsVal, setInputParamsVal] = useState([]);

  useEffect(() => {
    if (data && isOpen) {
      var paramsObj = JSON.parse(data.satSite.params);
      setSiteParamsKey(Object.keys(paramsObj));
      setSiteParamsVal(Object.values(paramsObj));
      for (var i = 0; i < Object.keys(paramsObj).length; i++) {
        setInputParamsVal((inputParams) => [...inputParams, ""]);
      }
    }
  }, [data, isOpen]);

  const onChangeParams = (e, index) => {
    const updatedInputParams = [...inputParamsVal];
    updatedInputParams[index] = e.target.value;
    setInputParamsVal(updatedInputParams);
  };

  const mapArrIntoJson = (keys, values) => {
    var obj = {};
    for (var i = 0; i < keys.length; i++) {
      obj[keys[i]] = values[i];
    }
    return obj;
  };

  const AddSite = async (e) => {
    e.preventDefault();
    var paramsJson = mapArrIntoJson(siteParamsKey, inputParamsVal);

    const newSiteDetail = {
      url: inputUrl,
      params: JSON.stringify(paramsJson),
    };

    const result = await usePostFetch(
      SatSiteURL.getAddSiteDetail(sat_site_id),
      "POST",
      null,
      newSiteDetail,
      onAction,
      setOnAction,
      setIsPending,
      toggle
    );
    if (result) {
      setInputUrl("");
      setInputParamsVal([]);
    }
  };

  return (
    <Modal show={isOpen} size="lg" centered>
      <form onSubmit={(e) => AddSite(e)}>
        <Modal.Header>
          <h6 className="m-0 font-weight-bold text-primary">
            Thêm site vệ tinh thuộc {data && data.satSite.name}
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
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
              />
            </div>
          </div>
          {data && data.satSite.has_api ? (
            siteParamsKey &&
            siteParamsKey.map((param, index) => {
              return (
                <div className="form-group row" key={index}>
                  <label className="col-sm-3 font-weight-bold col-form-label">
                    {param} <span className="text-danger">*</span>{" "}
                  </label>
                  <div className="col-sm-9">
                    <input
                      className="form-control"
                      required
                      value={inputParamsVal[index]}
                      onChange={(e) => onChangeParams(e, index)}
                    />
                    <p className="text-s font-italic mt-1">
                      Miêu tả: {siteParamsVal[index]}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <></>
          )}
        </Modal.Body>
        <Modal.Footer>
          {isPending ? (
            <>
              <Button variant="secondary" onClick={toggle} disabled>
                Đóng
              </Button>
              <Button type="submit" variant="primary" disabled>
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

export default AddSiteDetail;
