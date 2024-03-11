import { Modal, Button } from "react-bootstrap";
import usePostFetch from "../../Hook/usePostFetch";
import { PostURL } from "../../Constants/PostURL";

const ValEditPostModal = ({
  isOpen,
  toggle,
  error,
  warning,
  post_id,
  editedPost,
  setIsPending,
  isPostExistSch,
  toggleConfirmAddModal,
}) => {
  const EditPost = async (e) => {
    e.preventDefault();
    await usePostFetch(
      PostURL.editDel(post_id),
      "PUT",
      null,
      editedPost,
      null,
      null,
      setIsPending
    );
  };

  return (
    <>
      <Modal show={isOpen} size="lg" centered>
        <form
          onSubmit={(e) =>
            isPostExistSch() ? toggleConfirmAddModal(e) : EditPost(e)
          }
        >
          <Modal.Header>
            <h5 className="m-0 font-weight-bold text-info">
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
            {error.length || warning.length ? (
              <div>
                {error.map((item, index) => {
                  return (
                    <p key={index}>
                      <span className="text-danger">Lỗi: </span>
                      {item}
                    </p>
                  );
                })}
                {warning.map((item, index) => {
                  return (
                    <p key={index}>
                      <span className="text-warning">Cảnh báo: </span>
                      {item}
                    </p>
                  );
                })}
                {!error.length && (
                  <p>
                    <strong>Bạn có muốn tiếp tục cập nhật bài viết?</strong>
                  </p>
                )}
              </div>
            ) : (
              <p>
                <strong>Bạn chắc chắn muốn cập nhật bài viết?</strong>
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            {!error.length && (
              <Button variant="primary" type="submit" onClick={toggle}>
                Cập nhật
              </Button>
            )}
            <Button variant="secondary" onClick={toggle}>
              Đóng
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default ValEditPostModal;
