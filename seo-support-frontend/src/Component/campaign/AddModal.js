import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { CampaignURL } from "../../Constants/CampaignURL";
import usePostFetch from "../../Hook/usePostFetch";

const AddModal = ({ isOpen, toggle, onAction, setOnAction }) => {
  const [campaignName, setCampaignName] = useState("");
  const [campaignUrl, setCampaignUrl] = useState("");
  const [isPending, setIsPending] = useState(false);

  const AddCampaign = async (e) => {
    e.preventDefault();
    var newCampaign = {
      campaignName,
      campaignUrl,
    };
    const result = await usePostFetch(CampaignURL.getAdd, "POST", null, newCampaign, onAction, setOnAction, setIsPending, toggle);
    if (result) {
      setCampaignName("");
      setCampaignUrl("");
    }
  };

  return (
    <Modal show={isOpen} size="lg" centered>
      <form onSubmit={(e) => AddCampaign(e)}>
        <Modal.Header>
          <h6 className="m-0 font-weight-bold text-primary">Thêm chiến dịch</h6>
          <button type="button" className="close" onClick={toggle}>
            ×
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group row">
            <label className="col-sm-3 font-weight-bold col-form-label">
              Tên chiến dịch <span className="text-danger">*</span>{" "}
            </label>
            <div className="col-sm-9">
              <input
                className="form-control"
                id="campaign_name"
                required
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 font-weight-bold col-form-label">
              URL <span className="text-danger">*</span>{" "}
            </label>
            <div className="col-sm-9">
              <input
                className="form-control"
                id="campaign_url"
                required
                value={campaignUrl}
                onChange={(e) => setCampaignUrl(e.target.value)}
              />
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

export default AddModal;
