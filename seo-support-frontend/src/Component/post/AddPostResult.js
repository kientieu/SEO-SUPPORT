import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const AddPostResult = ({ isOpen, toggle, result, isPostToSiteClicked }) => {
  return (
    <Modal show={isOpen} size="lg" centered>
      <Modal.Header>
        {result.code === 200 ? (
          <h5 className="m-0 font-weight-bold text-success">
            {result.message}
          </h5>
        ) : (
          <h5 className="m-0 font-weight-bold text-danger">
            Thêm bài viết thất bại
          </h5>
        )}
        <Link
          to={
            isPostToSiteClicked && result.code === 200
              ? `/post/back-link/${result.data}`
              : `/post`
          }
        >
          <button type="button" className="close" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
        </Link>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          {result.code === 200 ? (
            <p>
              Mã bài viết mới: <strong>{result.data}</strong>
            </p>
          ) : (
            <p>{result.message}</p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Link
          to={
            isPostToSiteClicked && result.code === 200
              ? `/post/back-link/${result.data}`
              : `/post`
          }
        >
          <Button variant="secondary">Đóng</Button>
        </Link>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPostResult;
