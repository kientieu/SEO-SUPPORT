import { useEffect, useState } from "react";
import Select from "react-select";
import AddAccTab from "./AddAccTab";
import TransformPwd from "../../Services/TransformPwd";
import "./css/site-detail.css";
import { itemsPerPage } from "../../Constants/Pagination";
import PagePagination from "../pagination/PagePagination";

const SiteDetailList = ({ siteDetail, siteAcc, onAction, setOnAction }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectAcc, setSelectAcc] = useState([]);
  const [accPwd, setAccPwd] = useState([]);
  const [pwdShown, setPwdShown] = useState([]);
  const [pwdShownIcon, setPwdShownIcon] = useState([]);
  const [addAccTab, setAddAccTab] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [activeData, setActiveData] = useState([]);

  useEffect(() => {
    if (siteDetail) {
      setActiveData(
        siteDetail.slice(
          (activePage - 1) * itemsPerPage,
          activePage * itemsPerPage
        )
      );
    }
  }, [siteDetail, activePage]);

  const customSelectStyles = {
    // Fix the overlapping problem of the Select component
    menu: (provided) => ({ ...provided, zIndex: 9999 }),
  };

  const setSelectOptions = (siteId) => {
    const toSelectOption = ({ _id, username }) => ({
      label: username,
      value: _id,
    });
    setAccounts(siteAcc[siteId].map(toSelectOption));
  };

  useEffect(() => {
    if (siteAcc) {
      for (var i = 0; i < Object.keys(siteAcc).length; i++) {
        setPwdShown((value) => [...value, false]);
        setPwdShownIcon((value) => [...value, "fa-eye"]);
        setAddAccTab((value) => [...value, false]);
      }
    }
  }, [siteAcc]);

  const onChangeSelectAcc = (option, { action }, index, siteId) => {
    //Select Account
    const updatedSelectAcc = [...selectAcc];
    updatedSelectAcc[index] = option;
    setSelectAcc(updatedSelectAcc);
    //Corresponding Pwd
    let fullAcc = siteAcc[siteId].filter(
      (item, i) => item._id === option.value
    );
    let decryptedPwd = TransformPwd.decrypted(
      fullAcc[0].username,
      fullAcc[0].created_at,
      fullAcc[0].password
    );
    const updatedAccPwd = [...accPwd];
    updatedAccPwd[index] = decryptedPwd;
    setAccPwd(updatedAccPwd);
  };

  const togglePwd = (index) => {
    const updatedPwdShown = [...pwdShown];
    updatedPwdShown[index] = !pwdShown[index];
    setPwdShown(updatedPwdShown);

    const updatedPwdShownIcon = [...pwdShownIcon];
    if (!pwdShown[index]) {
      updatedPwdShownIcon[index] = "fa-eye-slash";
    } else {
      updatedPwdShownIcon[index] = "fa-eye";
    }
    setPwdShownIcon(updatedPwdShownIcon);
  };

  const toggleAddAccTab = (index) => {
    const updatedAddAccTab = [...addAccTab];
    updatedAddAccTab[index] = !addAccTab[index];
    setAddAccTab(updatedAddAccTab);
  };

  const handleAddNewAccount = (index) => {
    toggleAddAccTab(index);
  };

  return (
    <>
      <div className="row">
        {activeData.map((detail, index) => {
          return (
            <div className="col-xl-6 col-md-12 mb-4" key={detail._id}>
              <div className={`card border-left-info shadow h-100 py-2`}>
                <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                  <a target="_blank" rel="noreferrer" href={detail.url}>
                    {detail.url}
                  </a>
                  {addAccTab[index] ? (
                    <i
                      className="fas fa-arrow-alt-circle-left fa-lg"
                      style={{ color: "black" }}
                      onClick={() => handleAddNewAccount(index)}
                    ></i>
                  ) : (
                    <i
                      className="fas fa-plus-circle fa-lg"
                      style={{ color: "green" }}
                      onClick={() => handleAddNewAccount(index)}
                    ></i>
                  )}
                </div>
                <div className="card-body">
                  {addAccTab[index] ? (
                    <AddAccTab
                      siteDetails={detail}
                      index={index}
                      pwdShown={pwdShown}
                      pwdShownIcon={pwdShownIcon}
                      togglePwd={togglePwd}
                      onAction={onAction}
                      setOnAction={setOnAction}
                    />
                  ) : (
                    <>
                      <div className="row mb-2">
                        <label className="col-sm-3 mt-1">Tài khoản</label>
                        <div className="col-sm-9">
                          <Select
                            name="colors"
                            options={accounts}
                            classNamePrefix="select"
                            onFocus={() => setSelectOptions(detail._id)}
                            value={selectAcc[index]}
                            onChange={(option, e) =>
                              onChangeSelectAcc(option, e, index, detail._id)
                            }
                            styles={customSelectStyles}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <label className="col-sm-3 mt-1">Mật khẩu</label>
                        <div className="col-sm-9">
                          <input
                            className="form-control"
                            disabled
                            type={pwdShown[index] ? "text" : "password"}
                            value={accPwd[index] || ""}
                          />
                          <i
                            className={`fas ${pwdShownIcon[index]} fa-sm input-icons`}
                            onClick={() => togglePwd(index)}
                          ></i>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {siteDetail && (
        <PagePagination
          data={siteDetail}
          activePage={activePage}
          setActivePage={setActivePage}
          setOnAction={setOnAction}
        />
      )}
    </>
  );
};

export default SiteDetailList;
