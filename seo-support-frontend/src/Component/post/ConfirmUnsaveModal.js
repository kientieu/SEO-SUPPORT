import { Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ConfirmUnsaveModal = ({ isOpen, toggle, postId }) => {
  return (
    <Modal show={isOpen} size="lg" centered>
      <Modal.Header>
        <h5 className="m-0 font-weight-bold text-danger">Thông báo xác nhận</h5>
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
        <div className="text-center">
          <p>
            Mọi thao tác chỉnh sửa sẽ <strong>không được lưu</strong>. Bạn có
            muốn tiếp tục?
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Link to={`/post/back-link/${postId}`}>
          <Button variant="danger">Xác nhận</Button>
        </Link>
        <Button variant="secondary" onClick={toggle}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmUnsaveModal;
