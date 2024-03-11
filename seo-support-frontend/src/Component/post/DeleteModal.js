import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { PostURL } from "../../Constants/PostURL";
import usePostFetch from "../../Hook/usePostFetch";

const DeleteModal = ({
  isOpen,
  toggle,
  post,
  onAction,
  setOnAction,
}) => {
  const [isPending, setIsPending] = useState(false);

  const DeletePost = async (e) => {
    e.preventDefault();
    await usePostFetch(
      PostURL.editDel(post._id),
      "DELETE",
      null,
      null,
      onAction,
      setOnAction,
      setIsPending,
      toggle
    );
  };

  return (
    <Modal show={isOpen} size="lg" centered>
      <form onSubmit={(e) => DeletePost(e)}>
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
            Bạn có chắc chắn muốn xoá bài viết <b>{post.title}</b> ?
          </p>
          <i>ID: {post._id}</i>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggle} disabled={isPending}>
            Huỷ
          </Button>
          {isPending ? (
            <Button type="submit" variant="danger" disabled>
              Đang Xoá...
            </Button>
          ) : (
            <Button type="submit" variant="danger">
              Xoá
            </Button>
          )}
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default DeleteModal;
