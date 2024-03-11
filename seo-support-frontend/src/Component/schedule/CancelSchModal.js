import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { ScheduleURL } from "../../Constants/ScheduleURL";
import usePostFetch from "../../Hook/usePostFetch";
import LoadingIndicator from "../LoadingIndicator";

const CancelSchModal = ({ isOpen, toggle, schInfo, onAction, setOnAction }) => {
  const [isPending, setIsPending] = useState(false);

  const CancelSch = async (e) => {
    e.preventDefault();
    await usePostFetch(
      ScheduleURL.cancelAutoSch(schInfo._id),
      "POST",
      null,
      null,
      onAction,
      setOnAction,
      setIsPending,
      toggle
    );
  };

  return (
    <>
      {isPending && <LoadingIndicator />}
      <Modal show={isOpen} size="lg" centered>
        <form onSubmit={(e) => CancelSch(e)}>
          <Modal.Header>
            <h5 className="m-0 font-weight-bold text-primary">
              Xác nhận huỷ lập lịch
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
              Bạn có chắc chắn muốn huỷ lập lịch tự động có mã yêu cầu:{" "}
              <b>{schInfo._id}</b> ?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={toggle} disabled={isPending}>
              Đóng
            </Button>
            {isPending ? (
              <Button type="submit" variant="danger" disabled>
                Đang Huỷ...
              </Button>
            ) : (
              <Button type="submit" variant="danger">
                Huỷ
              </Button>
            )}
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default CancelSchModal;
