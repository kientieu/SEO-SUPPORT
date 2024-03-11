import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { CampaignURL } from "../../Constants/CampaignURL";
import usePostFetch from "../../Hook/usePostFetch";

const UnlockCfmModal = ({ isOpen, toggle, campaign, onAction, setOnAction }) => {
  const [isPending, setIsPending] = useState(false);

  const UnlockCampaign = async (e) => {
    e.preventDefault();
    const action = {
      action: "unlock"
    }
    await usePostFetch(
      CampaignURL.editLock(campaign._id),
      "POST",
      null,
      action,
      onAction,
      setOnAction,
      setIsPending,
      toggle
    );
  };

  return (
    <Modal show={isOpen} size="lg" centered>
      <form onSubmit={(e) => UnlockCampaign(e)}>
        <Modal.Header>
          <h5
            className="m-0 font-weight-bold text-primary"
            id="exampleModalLabel"
          >
            Thông báo xác nhận
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
          <p>
            Bạn có chắc chắn muốn mở lại chiến dịch <b>{campaign.name}</b> ?
          </p>
          <p>
            <i>
              <b>Lưu ý: </b>Tất cả Landing pages trong chiến dịch này cũng sẽ được mở lại!!!
            </i>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggle} disabled={isPending}>
            Huỷ
          </Button>
          {isPending ? (
            <Button type="submit" variant="danger" disabled>
              Đang xử lý...
            </Button>
          ) : (
            <Button type="submit" variant="danger">
              Xác nhận
            </Button>
          )}
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default UnlockCfmModal;
