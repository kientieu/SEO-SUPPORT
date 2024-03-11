import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { KeywordURL } from "../../Constants/KeywordURL";
import usePostFetch from "../../Hook/usePostFetch";
import LoadingIndicator from "../LoadingIndicator";
import { useParams } from "react-router-dom";

const DeleteModal = ({ isOpen, toggle, selectedLP, onAction, setOnAction }) => {
  const { keyword_id } = useParams();
  const [isPending, setIsPending] = useState(false);

  const DeleteLandingPage = async (e) => {
    e.preventDefault();
    const delData = {
      lpId: selectedLP._id,
    };

    await usePostFetch(
      KeywordURL.delLP(keyword_id),
      "DELETE",
      null,
      delData,
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
        <form onSubmit={(e) => DeleteLandingPage(e)}>
          <Modal.Header>
            <h5
              className="m-0 font-weight-bold text-info"
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
              Bạn có chắc chắn muốn xoá landing page <b>{selectedLP.url}</b> ?
            </p>
          </Modal.Body>
          <Modal.Footer>
            {isPending ? (
              <Button type="submit" variant="danger" disabled>
                Đang Xoá...
              </Button>
            ) : (
              <Button type="submit" variant="danger">
                Xoá
              </Button>
            )}
            <Button variant="secondary" onClick={toggle}>
              Huỷ
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default DeleteModal;
