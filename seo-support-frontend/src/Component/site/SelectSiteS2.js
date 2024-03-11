import { useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { SatSiteURL } from "../../Constants/SatSiteURL";
import Select from "react-select";
import useGetFetch from "../../Hook/useGetFetch";
import LoadingIndicator from "../LoadingIndicator";
import TransformPwd from "../../Services/TransformPwd";

const SelectSiteS2 = ({ setStep1, setStep2, finalDetail, setFinalDetail }) => {
  const { post_id } = useParams();
  const search = useLocation().search;
  const satSiteId = new URLSearchParams(search).get("site");

  const { data, isLoading } = useGetFetch(
    SatSiteURL.getAddSiteDetail(satSiteId)
  );
  const [accounts, setAccounts] = useState([]);
  const [selectAcc, setSelectAcc] = useState("");
  const [accPwd, setAccPwd] = useState("");
  const [pwdShown, setPwdShown] = useState(false);
  const [pwdShownIcon, setPwdShownIcon] = useState("fa-eye");
  const [selectSite, setSelectSite] = useState("");
  // const [selectSiteDetail, setSelectSiteDetail] = useState("");

  const customSelectStyles = {
    // Fix the overlapping problem of the Select component
    menu: (provided) => ({ ...provided, zIndex: 9999 }),
  };

  const setSelectOptions = (siteId) => {
    const toSelectOption = ({ _id, username }) => ({
      label: username,
      value: _id,
    });
    setAccounts(data.siteAcc[siteId].map(toSelectOption));
  };

  const onChangeSelectAcc = (option, { action }, siteId, siteUrl) => {
    //Select Account
    setSelectAcc(option);
    //Corresponding Pwd
    let fullAcc = data.siteAcc[siteId].filter(
      (item, i) => item._id === option.value
    );
    // setAccPwd(fullAcc[0].password);
    let encryptedPwd = TransformPwd.decrypted(
      fullAcc[0].username,
      fullAcc[0].created_at,
      fullAcc[0].password
    );
    setAccPwd(encryptedPwd);
    //Set Site Detail
    setFinalDetail({
      ...finalDetail,
      siteUrl,
      siteAccId: option.value,
      siteAcc: option.label,
      sitePwd: fullAcc[0].password,
    });
  };

  const togglePwd = () => {
    setPwdShown(!pwdShown);

    if (!pwdShown) {
      setPwdShownIcon("fa-eye-slash");
    } else {
      setPwdShownIcon("fa-eye");
    }
  };

  const onSiteDetailSelected = (e) => {
    var siteId = e.target.value;
    //Return initial value when select another site
    setSelectSite(siteId);
    setSelectAcc("");
    setAccPwd("");
    setPwdShown(false);
    setPwdShownIcon("fa-eye");
  };

  const isNextOnClick = () => {
    setStep2(true);
  };

  const isBackOnClick = () => {
    setStep1(false);
  };

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <div className="card shadow mb-4">
        <div className="m-3">
          {data &&
            data.siteDetail.map((detail, index) => {
              return (
                <span className="row m-3" key={detail._id}>
                  <input
                    className="col-xs-2"
                    type="radio"
                    value={`${detail._id}`}
                    name="siteDetail"
                    onChange={(e) => onSiteDetailSelected(e, index)}
                  />
                  <div className="card border-left-info shadow h-100 py-2 col-10 ml-2">
                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <a target="_blank" rel="noreferrer" href={detail.url}>
                        {detail.url}
                      </a>
                    </div>
                    <div className="card-body">
                      {selectSite === detail._id && (
                        <>
                          <div className="row">
                            <label className="col-sm-3">
                              Tài khoản <span className="text-danger">*</span>
                            </label>
                            <div className="col-sm-9">
                              <Select
                                name="colors"
                                options={accounts}
                                classNamePrefix="select"
                                onFocus={() => setSelectOptions(detail._id)}
                                value={selectAcc[index]}
                                onChange={(option, e) =>
                                  onChangeSelectAcc(
                                    option,
                                    e,
                                    detail._id,
                                    detail.url
                                  )
                                }
                                styles={customSelectStyles}
                              />
                            </div>
                          </div>
                          <div className="row mt-2">
                            <label className="col-sm-3">Mật khẩu</label>
                            <div className="col-sm-8">
                              <input
                                className="form-control"
                                disabled
                                type={pwdShown ? "text" : "password"}
                                value={accPwd}
                              />
                              <i
                                className={`fas ${pwdShownIcon} fa-sm input-icons`}
                                onClick={togglePwd}
                              ></i>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </span>
              );
            })}
        </div>
      </div>
      <div className="form-group row mt-2 float-right">
        <button
          type="button"
          className="btn btn-dark mr-2"
          onClick={isBackOnClick}
        >
          <Link
            to={`/post/back-link/${post_id}`}
            style={{ textDecoration: "none", color: "white" }}
          >
            Quay lại
          </Link>
        </button>
        <button
          type="button"
          className="btn btn-primary mr-2"
          disabled={selectAcc === "" ? true : false}
          onClick={isNextOnClick}
        >
          {selectAcc === "" ? (
            <span>Tiếp theo</span>
          ) : (
            <Link
              to={`/post/back-link/${post_id}?site=${satSiteId}`}
              style={{ textDecoration: "none", color: "white" }}
            >
              Tiếp theo
            </Link>
          )}
        </button>
      </div>
    </>
  );
};

export default SelectSiteS2;
