import { Modal, Button } from "react-bootstrap";

const AddSchResult = ({ isOpen, toggle, addSchResult, toggleAddSchedule, setStep2 }) => {
  const closeButtonHandler = () => {
    toggle();
    toggleAddSchedule();
    setStep2(true);
  };

  return (
    <Modal show={isOpen} size="lg" centered>
      <form>
        <Modal.Header>
          {addSchResult.code === 200 ? (
            <h5 className="m-0 font-weight-bold text-success">
              <i
                class="fas fa-check-circle fa-1x fa-fw"
                style={{ color: "green" }}
              ></i>
              {addSchResult.message}
            </h5>
          ) : (
            <h5 className="m-0 font-weight-bold text-danger">
              <i
                class="fas fa-exclamation-circle fa-2x fa-fw"
                style={{ color: "red" }}
              ></i>
              {addSchResult.message}
            </h5>
          )}

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
          {addSchResult.data && (
            <p>
              Mã yêu cầu vừa tạo: <b>{addSchResult.data}</b>
            </p>
          )}
          {addSchResult.error && (
            <p>Tạo lập lịch thất bại: {addSchResult.error}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="primary" onClick={closeButtonHandler}>
            Đóng
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AddSchResult;
