import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { LPURL } from "../../Constants/LPURL";
import usePostFetch from "../../Hook/usePostFetch";
import LatinizeString from "../../Services/LatinizeString";

const EditModal = ({
  isOpen,
  toggle,
  item,
  campaign,
  onAction,
  setOnAction,
}) => {
  const [keyword, setKeyword] = useState("");
  const [lpURL, setLPURL] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setKeyword(item.main_kw.name);
      setLPURL(item.url);
    }
  }, [isOpen, item]);

  var editLP = {
    campaignID: campaign._id,
    kwName: keyword,
    lpURL,
  };

  const suggestLPURL = (e) => {
    var kwValue = e.target.value;
    setKeyword(kwValue);
    if (!LatinizeString.isLatin(kwValue)) {
        kwValue = LatinizeString.latinize(kwValue);
    }
    kwValue = kwValue.toLowerCase().replace(/\s/g, '-');
    var suggestURL = `${campaign.url}/${kwValue}`;
    setLPURL(suggestURL);
  };

  const EditLandingPage = async (e) => {
    e.preventDefault();
    await usePostFetch(
      LPURL.editLock(item._id),
      "PUT",
      null,
      editLP,
      onAction,
      setOnAction,
      setIsPending,
      toggle
    );
  };

  return (
    <Modal show={isOpen} size="lg" centered>
      <form onSubmit={(e) => EditLandingPage(e)}>
        <Modal.Header>
          <h6 className="m-0 font-weight-bold text-primary">
            Cập nhật thông tin
          </h6>
          <button type="button" className="close" onClick={toggle}>
            ×
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group row">
            <label className="col-sm-3 font-weight-bold col-form-label">
              Từ khoá <span className="text-danger">*</span>
            </label>
            <div className="col-sm-9">
              <input
                className="form-control"
                id="keyword"
                value={keyword}
                required
                onChange={(e) => {
                  suggestLPURL(e);
                }}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 font-weight-bold col-form-label">
              Đường dẫn
            </label>
            <div className="col-sm-9">
              <input
                className="form-control"
                id="landingpage_url"
                value={lpURL}
                required
                onChange={(e) => setLPURL(e.target.value)}
              />
              <p className="text-primary">
                (Đường dẫn sẽ sinh tự động nếu người dùng không điền vào)
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggle}>
            Đóng
          </Button>
          {isPending ? (
            <Button type="submit" variant="primary" disabled>
              Đang Lưu...
            </Button>
          ) : (
            <Button type="submit" variant="primary">
              Lưu
            </Button>
          )}
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default EditModal;
