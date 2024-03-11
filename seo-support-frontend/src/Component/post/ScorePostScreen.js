import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import useGetFetch from "../../Hook/useGetFetch";
import { PostURL } from "../../Constants/PostURL";
import LoadingIndicator from "../LoadingIndicator";
import "./css/score-post-screen.css";

const ScorePostScreen = ({ toggle, selectedPost, result }) => {
  const ScorePostList = ({ post, index }) => {
    const { data: postDetails, isLoading } = useGetFetch(
      PostURL.getDetails(post._id)
    );

    return (
      <>
        {isLoading && <LoadingIndicator />}
        {postDetails && (
          <div className="row">
            <div className="card shadow mb-4">
              <div className="card-header">
                <div className="row">
                  <div className="col-xl-11 col-10">
                    <label className="mt-2 mr-2">Tiêu đề</label>
                    <input
                      type="text"
                      className="form-control"
                      value={postDetails.title}
                      disabled
                    />
                  </div>
                  {result && (
                    <div className="col-xl-1 col-2">
                      <div className="circle">
                        {(result[index][1] * 100).toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-body">
                <CKEditor
                  // editor={ClassicEditor}
                  editor={Editor}
                  data={postDetails.content}
                  onReady={(editor) => {
                    editor.editing.view.change((writer) => {
                      writer.setStyle(
                        "height",
                        "300px",
                        editor.editing.view.document.getRoot()
                      );
                    });
                  }}
                  disabled
                />
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div id="wrapper" className="content--custom">
        {/* Content Wrapper */}
        <div id="content-wrapper" className="d-flex flex-column">
          {/* Main Content */}
          <div id="content" style={{ height: "100vh" }}>
            {/* <Topbar /> */}

            <div className="container-fluid">
              {/* Page Heading */}
              <h3 className="mb-3 font-weight-bold text-center">
                CHẤM ĐIỂM BÀI VIẾT
                <button type="button" className="close" onClick={toggle}>
                  x
                </button>
              </h3>

              {selectedPost.map((item, index) => {
                return (
                  <div key={item._id}>
                    <ScorePostList post={item} index={index} />
                  </div>
                );
              })}

              <div className="form-group row mt-2 float-right">
                <button
                  type="button"
                  className="btn btn-dark mr-2"
                  onClick={toggle}
                >
                  Quay lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScorePostScreen;
