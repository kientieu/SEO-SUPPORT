import { Modal, Button } from "react-bootstrap";

const ImportFileResult = ({ isOpen, toggle, result, setResult }) => {
  const handleCloseOnClick = () => {
    setResult(null);
    toggle();
  };

  return (
    <>
      <Modal show={isOpen} size="lg" centered>
        <form>
          <Modal.Header>
            <h5 className="m-0 font-weight-bold text-info">Kết quả</h5>
            <button
              type="button"
              className="close"
              onClick={handleCloseOnClick}
            >
              ×
            </button>
          </Modal.Header>
          <Modal.Body>
            <div>
              {result.code === 200 &&
                result.data &&
                result.data.map((item, index) => {
                  let keysInObj = Object.keys(item);
                  let valuesInObj = Object.values(item);
                  let indexMsg = keysInObj.indexOf("message");
                  if (index !== -1) {
                    keysInObj.splice(indexMsg, 1);
                  }

                  return (
                    <div
                      className="row d-flex just-content-between"
                      key={item[`${keysInObj[0]}`]}
                    >
                      <p className="col-12">
                        {`${index + 1}. ${item.message}:`}
                      </p>
                      <ul>
                        {keysInObj.map((keyObj, indexKey) => {
                          return (
                            <li key={valuesInObj[indexKey]}>
                              {valuesInObj[indexKey]}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseOnClick}>
              Đóng
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default ImportFileResult;
