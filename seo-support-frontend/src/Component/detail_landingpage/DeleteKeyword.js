import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { DetailLPURL } from "../../Constants/DetailLPURL";
import usePostFetch from "../../Hook/usePostFetch";
import { useParams } from "react-router-dom";
import LoadingIndicator from "../LoadingIndicator";

const DeleteKeyword = ({
  isOpen,
  toggle,
  selectedKW,
  onAction,
  setOnAction,
}) => {
  const { lp_id } = useParams();
  const [isPending, setIsPending] = useState(false);

  const DeleteKeyword = async (e) => {
    e.preventDefault();
    const delData = {
      kwId: selectedKW._id,
    };
    // console.log(lp_id, delData);
    await usePostFetch(
      DetailLPURL.delKW(lp_id),
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
        <form onSubmit={(e) => DeleteKeyword(e)}>
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
              Bạn có chắc chắn muốn xoá từ khoá <b>{selectedKW.name}</b> ?
            </p>
          </Modal.Body>
          <Modal.Footer>
            {isPending ? (
              <Button type="button" variant="danger" disabled>
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

export default DeleteKeyword;
