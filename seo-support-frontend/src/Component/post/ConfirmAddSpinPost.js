import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { PostURL } from "../../Constants/PostURL";
import usePostFetch from "../../Hook/usePostFetch";
import LoadingIndicator from "../LoadingIndicator";
import { Link } from "react-router-dom";

const ConfirmAddSpinPost = ({
  isOpen,
  toggle,
  postId,
  checkedState,
  spinTitle,
  spinContent,
}) => {
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState(null);

  const AddSpinPost = async (e) => {
    e.preventDefault();
    var chosenPosts = [];
    checkedState.forEach((item, index) => {
      if (item) {
        chosenPosts.push({
          spinTitle: spinTitle[index],
          spinContent: spinContent[index],
        });
      }
    });
    const postData = {
      chosenPosts,
    };
    setResult(
      await usePostFetch(
        PostURL.addPostSpinner(postId),
        "POST",
        null,
        postData,
        null,
        null,
        setIsPending,
        null
      )
    );
  };

  return (
    <>
      {isPending && <LoadingIndicator />}
      {result ? (
        <Modal show={isOpen} size="lg" centered>
          <Modal.Header>
            {result.code === 200 ? (
              <h5 className="m-0 font-weight-bold text-success">
                {result.message}
              </h5>
            ) : (
              <h5 className="m-0 font-weight-bold text-danger">
                Thêm bài viết spin thất bại
              </h5>
            )}
            <Link to={`/post`}>
              <button type="button" className="close" aria-label="Close">
                <span aria-hidden="true">×</span>
              </button>
            </Link>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center">
              {result.code === 200 ? (
                <div className="d-flex just-content-between">
                  <p>Mã bài viết mới:</p>
                  <ul>
                    {result.data.map((item) => {
                      return (
                        <li key={item}>
                          <strong>{item}</strong>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <p>{result.message}</p>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Link to={`/post`}>
              <Button variant="secondary">Đóng</Button>
            </Link>
          </Modal.Footer>
        </Modal>
      ) : (
        <Modal show={isOpen} size="lg" centered>
          <form onSubmit={(e) => AddSpinPost(e)}>
            <Modal.Header>
              <h5 className="m-0 font-weight-bold text-primary">
                Xác nhận lưu
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
              <div className="text-center">
                <p>
                  Những bài viết spin này sẽ được lưu ở mục:{" "}
                  <b>Bài viết {"->"} Bài viết tự động</b>
                </p>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={toggle} disabled={isPending}>
                Huỷ
              </Button>
              {isPending ? (
                <Button type="submit" variant="primary" disabled>
                  Đang lưu...
                </Button>
              ) : (
                <Button type="submit" variant="primary">
                  Xác nhận
                </Button>
              )}
            </Modal.Footer>
          </form>
        </Modal>
      )}
    </>
  );
};

export default ConfirmAddSpinPost;
