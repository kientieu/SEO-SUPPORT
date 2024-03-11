import { useState } from "react";
import { SatSiteURL } from "../../Constants/SatSiteURL";
import usePostFetch from "../../Hook/usePostFetch";
import LoadingIndicator from "../LoadingIndicator";

const AddAccTab = ({
  siteDetails,
  index,
  pwdShown,
  pwdShownIcon,
  togglePwd,
  onAction,
  setOnAction
}) => {
  const [newUsername, setNewUsername] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [isPending, setIsPending] = useState(false);

  const AddNewAcc = async (e) => {
    e.preventDefault();
    const newSiteAcc = {
      siteDetails,
      newUsername,
      newPwd,
    };
    const result = await usePostFetch(
      SatSiteURL.addSiteAcc,
      "POST",
      null,
      newSiteAcc,
      onAction,
      setOnAction,
      setIsPending
    );
    if (result) {
      setNewUsername("");
      setNewPwd("");
    }
  };

  return (
    <>
      {isPending && <LoadingIndicator />}
      <form onSubmit={(e) => AddNewAcc(e)}>
        <div className="row mb-2">
          <label className="col-sm-3 mt-1">Tài khoản</label>
          <div className="col-sm-9">
            <input
              maxLength={100}
              className="form-control"
              type="text"
              required
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <label className="col-sm-3 mt-1">Mật khẩu</label>
          <div className="col-sm-9">
            <input
              maxLength={50}
              className="form-control"
              type={pwdShown[index] ? "text" : "password"}
              required
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
            />
            <i
              className={`fas ${pwdShownIcon[index]} fa-sm input-icons`}
              onClick={() => togglePwd(index)}
            ></i>
          </div>
        </div>
        <div className="row float-right mt-3">
          <button type="submit" className="btn btn-primary rounded-pill">
            <i className="fas fa-plus fa-sm"></i> Thêm tài khoản
          </button>
        </div>
      </form>
    </>
  );
};

export default AddAccTab;
