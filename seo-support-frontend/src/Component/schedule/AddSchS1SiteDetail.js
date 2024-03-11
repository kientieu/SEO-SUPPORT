import { useState } from "react";
import Select from "react-select";
import { SatSiteURL } from "../../Constants/SatSiteURL";
import useGetFetch from "../../Hook/useGetFetch";
import TransformPwd from "../../Services/TransformPwd";
import AddSiteAccModal from "./AddSiteAccModal";

const AddSchS1SiteDetail = ({
  selectSite,
  selectSiteDetail,
  setSelectSiteDetail,
  selectAcc,
  setSelectAcc,
  accPwd,
  setAccPwd,
}) => {
  const [siteDetailOpts, setSiteDetailOpts] = useState([]);
  const [accOpts, setAccOpts] = useState([]);
  const [pwdShown, setPwdShown] = useState(false);
  const [pwdShownIcon, setPwdShownIcon] = useState("fa-eye");
  const [addSiteAcc, setAddSiteAcc] = useState(false);
  const [onAction, setOnAction] = useState(false);

  const { data, isLoading: isSiteDetailLoading } = useGetFetch(
    SatSiteURL.getAddSiteDetail(selectSite),
    null,
    onAction
  );

  const customSelectStyles = {
    // Fix the overlapping problem of the Select component
    menu: (provided) => ({ ...provided, zIndex: 9999 }),
  };

  function setSiteDetailOptions() {
    const toSelectOption = ({ _id, url }) => ({
      label: url,
      value: _id,
    });
    setSiteDetailOpts(data.siteDetail.map(toSelectOption));
  }

  function selectSiteDetailHandler(option) {
    setSelectSiteDetail(option);
    setSelectAcc("");
    setAccPwd("");
    setPwdShown(false);
    setPwdShownIcon("fa-eye");
  }

  function setAccountOptions() {
    const toSelectOption = ({ _id, username }) => ({
      label: username,
      value: _id,
    });
    setAccOpts(data.siteAcc[`${selectSiteDetail.value}`].map(toSelectOption));
  }

  function selectAccHandler(option) {
    setSelectAcc(option);
    //Corresponding Pwd
    let fullAcc = data.siteAcc[`${selectSiteDetail.value}`].filter(
      (item) => item._id === option.value
    );
    let encryptedPwd = TransformPwd.decrypted(
      fullAcc[0].username,
      fullAcc[0].created_at,
      fullAcc[0].password
    );
    setAccPwd(encryptedPwd);
  }

  function togglePwd() {
    setPwdShown(!pwdShown);

    if (!pwdShown) {
      setPwdShownIcon("fa-eye-slash");
    } else {
      setPwdShownIcon("fa-eye");
    }
  }

  const toggleAddSiteAcc = () => {
    setAddSiteAcc(!addSiteAcc);
  };

  return (
    <>
      <div className="row m-3">
        <label className="col-2 mt-2">
          Chọn thông tin site <span className="text-danger">*</span>
        </label>
        <div className="col-10">
          <Select
            name="colors"
            options={siteDetailOpts}
            classNamePrefix="select"
            onFocus={setSiteDetailOptions}
            value={selectSiteDetail}
            onChange={(option) => selectSiteDetailHandler(option)}
            isLoading={isSiteDetailLoading}
            styles={customSelectStyles}
          />
        </div>
      </div>

      <div className="row m-3">
        <label className="col-2 mt-2">
          Chọn tài khoản <span className="text-danger">*</span>
        </label>
        <div className="col-8">
          <Select
            name="colors"
            options={accOpts}
            classNamePrefix="select"
            onFocus={setAccountOptions}
            value={selectAcc}
            onChange={(option) => selectAccHandler(option)}
            isLoading={isSiteDetailLoading}
            isDisabled={selectSiteDetail === "" ? true : false}
            styles={customSelectStyles}
          />
        </div>
        {selectSiteDetail && (
          <span className="col-2 mt-2">
            <i
              className="fas fa-plus-circle fa-lg"
              style={{ color: "green" }}
              onClick={toggleAddSiteAcc}
            ></i>
          </span>
        )}
      </div>
      <div className="row m-3">
        <label className="col-2 mt-2">Mật khẩu</label>
        <div className="col-8">
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

      <AddSiteAccModal
        isOpen={addSiteAcc}
        toggle={toggleAddSiteAcc}
        selectSiteDetail={selectSiteDetail}
        onAction={onAction}
        setOnAction={setOnAction}
      />
    </>
  );
};

export default AddSchS1SiteDetail;
