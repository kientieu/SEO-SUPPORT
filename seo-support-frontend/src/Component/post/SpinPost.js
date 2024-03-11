import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import useGetFetch from "../../Hook/useGetFetch";
import { PostURL } from "../../Constants/PostURL";
import LoadingIndicator from "../LoadingIndicator";
import Select from "react-select";
import GetSpinPost from "./GetSpinPost";
import RedirectTo404 from "../RedirectTo404";
import ReactTooltip from "react-tooltip";

const SpinPost = () => {
  const { post_id } = useParams();

  const customSelectStyles = {
    // Fix the overlapping problem of the Select component
    menu: (provided) => ({ ...provided, zIndex: 9999 }),
  };

  const [spinNum, setSpinNum] = useState("");
  const [spinNumOpts, setSpinNumOpts] = useState([]);
  const [scoreOriginResult, setScoreOriginResult] = useState(null);

  useEffect(() => {
    const maxSpinOpts = 10;
    var updatedSpinNumOpts = [];
    for (var i = 1; i <= maxSpinOpts; i++) {
      updatedSpinNumOpts.push({
        label: i,
        value: i,
      });
    }
    setSpinNumOpts(updatedSpinNumOpts);
  }, []);

  const [isSpinBtnClicked, setIsSpinBtnClicked] = useState(false);

  const { data: postDetails, isLoading } = useGetFetch(
    PostURL.getDetails(post_id)
  );

  const handleSpinBtn = () => {
    setIsSpinBtnClicked(true);
  };

  const tickFormatter = (value) => {
    const limit = 4; // put your maximum character
    if (!value) return;
    if (value.length < limit) return value;
    return `${value.substring(0, limit)}...`;
  };

  return (
    <>
      <div id="wrapper" className="content--custom">
        {/* Sidebar */}

        {/* Content Wrapper */}
        <div id="content-wrapper" className="d-flex flex-column">
          {/* Main Content */}
          <div id="content">
            {isLoading ? (
              <LoadingIndicator />
            ) : (
              !postDetails && <RedirectTo404 />
            )}

            <div className="container-fluid">
              {/* Page Heading */}
              <h3 className="mb-2 font-weight-bold text-center">
                SPIN BÀI VIẾT
                <Link to={"/post"}>
                  <button type="button" className="close">
                    x
                  </button>
                </Link>
              </h3>

              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <div className="row">
                    <div className="mt-2 mr-2">
                      Vui lòng chọn số lượng bài viết muốn spin:
                    </div>
                    <div className="col-xs-12 mr-2">
                      <Select
                        options={spinNumOpts}
                        value={spinNum}
                        onChange={(option) => setSpinNum(option)}
                        styles={customSelectStyles}
                      />
                    </div>
                    <button
                      className="col-xs-12 btn btn-primary"
                      disabled={spinNum === "" ? true : false}
                      onClick={handleSpinBtn}
                    >
                      Spin
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-xl-11 col-10">
                      <b>Bài viết gốc</b>
                    </div>

                    {/* {scoreOriginResult && (
                      <div className="col-xl-1 col-2">
                        <div
                          className="circle"
                          data-tip={scoreOriginResult[1].toPrecision(4)}
                        >
                          {tickFormatter(scoreOriginResult[1].toPrecision(4))}
                        </div>
                        <ReactTooltip />
                      </div>
                    )} */}
                  </div>
                  <div
                    className="form-group row mt-2"
                    style={{ padding: "0 1rem" }}
                  >
                    <label>Tiêu đề</label>
                    <input
                      type="text"
                      className="form-control"
                      disabled
                      value={postDetails ? postDetails.title : ""}
                    />
                  </div>
                  <CKEditor
                    // editor={ClassicEditor}
                    editor={Editor}
                    data={postDetails ? postDetails.content : ""}
                    onReady={(editor) => {
                      editor.editing.view.change((writer) => {
                        writer.setStyle(
                          "height",
                          "250px",
                          editor.editing.view.document.getRoot()
                        );
                      });
                    }}
                    disabled
                  />
                </div>
              </div>
              {isSpinBtnClicked && (
                <GetSpinPost
                  postId={post_id}
                  spinNum={spinNum}
                  originContent={postDetails.content}
                  setScoreOriginResult={setScoreOriginResult}
                />
              )}
            </div>
          </div>
          {/* End of Main Content */}
        </div>
        {/* End of Content Wrapper */}
      </div>
    </>
  );
};

export default SpinPost;
