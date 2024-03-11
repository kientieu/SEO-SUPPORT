import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { LPURL } from "../../Constants/LPURL";
import usePostFetch from "../../Hook/usePostFetch";

const UnlockLPModal = ({ isOpen, toggle, item, onAction, setOnAction }) => {
  const [isPending, setIsPending] = useState(false);

  const UnlockLandingPage = async (e) => {
    e.preventDefault();
    const actionObj = {
      action: "unlock"
    }
    await usePostFetch(
      LPURL.editLock(item._id),
      "POST",
      null,
      actionObj,
      onAction,
      setOnAction,
      setIsPending,
      toggle
    );
  };

  return (
    <Modal show={isOpen} size="lg" centered>
      <form onSubmit={(e) => UnlockLandingPage(e)}>
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
            Bạn có muốn mở landing page <b>{item.url}</b> ?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggle} disabled={isPending}>
            Huỷ
          </Button>
          {isPending ? (
            <Button type="submit" variant="danger" disabled>
              Đang Khoá...
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

export default UnlockLPModal;
