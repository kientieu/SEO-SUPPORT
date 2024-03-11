import { Modal, Button } from "react-bootstrap";
import usePostFetch from "../../Hook/usePostFetch";
import { PostURL } from "../../Constants/PostURL";

const ValAddPostModal = ({
  isOpen,
  toggle,
  error,
  warning,
  newPost,
  setIsPending,
  setAddResult,
  toggleAddPostResult,
}) => {
  const AddNewPost = async (e) => {
    e.preventDefault();
    const result = await usePostFetch(
      PostURL.getAdd,
      "POST",
      null,
      newPost,
      null,
      null,
      setIsPending
    );
    setAddResult(result);
    if (result) {
      toggleAddPostResult();
    }
  };

  return (
    <>
      <Modal show={isOpen} size="lg" centered>
        <form onSubmit={(e) => AddNewPost(e)}>
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
                    <div key={index} className="mb-2">
                      <span className="text-danger">Lỗi: </span>
                      {item}
                    </div>
                  );
                })}
                {warning.map((item, index) => {
                  return (
                    <div key={index}>
                      <span className="text-warning">Cảnh báo: </span>
                      {item}
                    </div>
                  );
                })}
                {!error.length && (
                  <p>
                    <strong>Bạn có muốn tiếp tục thêm bài viết?</strong>
                  </p>
                )}
              </div>
            ) : (
              <p>
                <strong>Bạn chắc chắn muốn thêm bài viết?</strong>
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            {!error.length && (
              <Button variant="primary" type="submit" onClick={toggle}>
                Thêm
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

export default ValAddPostModal;
