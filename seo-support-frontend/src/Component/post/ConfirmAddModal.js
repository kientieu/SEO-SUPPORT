import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { PostURL } from "../../Constants/PostURL";
import usePostFetch from "../../Hook/usePostFetch";
import LoadingIndicator from "../LoadingIndicator";
import { Link } from "react-router-dom";

const ConfirmAddModal = ({ isOpen, toggle, data }) => {
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState(null);

  const ConfirmAdd = async (e) => {
    e.preventDefault();
    const editedPost = {
      postTitle: data.postTitle,
      postContent: data.postContent,
      postTopic: data.selectedTopic.value,
      keyword: data.selectedKw.value,
      landingPage: data.selectedLP.value
    };
    setResult(
      await usePostFetch(
        PostURL.editDel(data.postId),
        "PUT",
        null,
        editedPost,
        null,
        null,
        setIsPending
      )
    );
  };

  return (
    <>
      {isPending && <LoadingIndicator />}
      {result ? (
        <Modal show={isOpen} size="lg" centered>
          <form onSubmit={(e) => ConfirmAdd(e)}>
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
              <Link to={`/post`}>
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
              <Link to={`/post`}>
                <Button variant="secondary">Đóng</Button>
              </Link>
            </Modal.Footer>
          </form>
        </Modal>
      ) : (
        <Modal show={isOpen} size="lg" centered>
          <form onSubmit={(e) => ConfirmAdd(e)}>
            <Modal.Header>
              <h5 className="m-0 font-weight-bold text-danger">
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
              <div className="text-center">
                <p>
                  Bài viết chỉnh sửa này sẽ được <strong>TẠO MỚI</strong> do bài
                  viết đã được đăng lên site vệ tinh.
                </p>
                <i>(Tránh trường hợp dữ liệu thống kê không khớp)</i>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={toggle} disabled={isPending}>
                Huỷ
              </Button>
              {isPending ? (
                <Button type="submit" variant="danger" disabled>
                  Đang Tạo...
                </Button>
              ) : (
                <Button type="submit" variant="danger">
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

export default ConfirmAddModal;
