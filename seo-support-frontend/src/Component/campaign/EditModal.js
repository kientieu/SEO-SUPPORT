import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { CampaignURL } from "../../Constants/CampaignURL";
import usePostFetch from "../../Hook/usePostFetch";

const EditModal = ({ isOpen, toggle, campaign, onAction, setOnAction }) => {
  const [campaignName, setCampaignName] = useState("");
  const [campaignUrl, setCampaignUrl] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCampaignName(campaign.name);
      setCampaignUrl(campaign.url);
    }
  }, [isOpen, campaign])

  const EditCampaign = async (e) => {
    e.preventDefault();
    var editCampaign = {
      campaignName,
      campaignUrl,
    };
    await usePostFetch(CampaignURL.editLock(campaign._id), "PUT", null, editCampaign, onAction, setOnAction, setIsPending, toggle);
  };

  return (
    <Modal show={isOpen} size="lg" centered>
      <form onSubmit={(e) => EditCampaign(e)}>
        <Modal.Header>
          <h6 className="m-0 font-weight-bold text-primary">Sửa chiến dịch</h6>
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

export default EditModal;
