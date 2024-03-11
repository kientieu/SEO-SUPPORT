import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import usePostFetch from "../../Hook/usePostFetch";
import LoadingIndicator from "../LoadingIndicator";
import { SatSiteURL } from "../../Constants/SatSiteURL";

const AddSiteAccModal = ({
  isOpen,
  toggle,
  selectSiteDetail,
  onAction,
  setOnAction,
}) => {
  const [isPending, setIsPending] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [pwdShown, setPwdShown] = useState(false);
  const [pwdShownIcon, setPwdShownIcon] = useState("fa-eye");

  function togglePwd() {
    setPwdShown(!pwdShown);

    if (!pwdShown) {
      setPwdShownIcon("fa-eye-slash");
    } else {
      setPwdShownIcon("fa-eye");
    }
  }

  const AddSiteAcc = async (e) => {
    e.preventDefault();
    const newSiteAcc = {
      siteDetails: {
        _id: selectSiteDetail.value,
        url: selectSiteDetail.label,
      },
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
      toggle();
    }
  };

  return (
    <>
      {isPending && <LoadingIndicator />}
      <Modal show={isOpen} size="lg" centered>
        <form onSubmit={(e) => AddSiteAcc(e)}>
          <Modal.Header>
            <h5 className="m-0 font-weight-bold text-primary">
              Thêm tài khoản cho site vệ tinh
            </h5>
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={toggle}
            >
              <span aria-hidden="true">×</span>
            </button>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group row m-3">
              <p className="col-sm-2">Site vệ tinh:</p>
              <div className="col-8">
                <input
                  className="form-control"
                  type="text"
                  disabled
                  value={selectSiteDetail.label}
                />
              </div>
            </div>
            <div className="form-group row m-3">
              <label className="col-2 mt-2">Tài khoản:</label>
              <div className="col-8">
                <input
                  className="form-control"
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group row m-3">
              <label className="col-2 mt-2">Mật khẩu:</label>
              <div className="col-8">
                <input
                  className="form-control"
                  type={pwdShown ? "text" : "password"}
                  required
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                />
                <i
                  className={`fas ${pwdShownIcon} fa-sm input-icons`}
                  onClick={togglePwd}
                ></i>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={toggle} disabled={isPending}>
              Đóng
            </Button>
            {isPending ? (
              <Button type="submit" variant="danger" disabled>
                Đang Thêm...
              </Button>
            ) : (
              <Button type="submit" variant="danger">
                Thêm
              </Button>
            )}
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default AddSiteAccModal;
