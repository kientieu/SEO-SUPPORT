// import { useState } from "react";
// import { Link, useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import useGetFetch from "../../Hook/useGetFetch";
import { PostURL } from "../../Constants/PostURL";
import LoadingIndicator from "../LoadingIndicator";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConfirmAddSpinPost from "./ConfirmAddSpinPost";
import usePostFetch from "../../Hook/usePostFetch";
import ReactTooltip from "react-tooltip";

import "./css/score-post-screen.css";

const GetSpinPost = ({
  postId,
  originContent,
  spinNum,
  setScoreOriginResult,
}) => {
  const [checkedState, setCheckedState] = useState(
    new Array(parseInt(spinNum.value)).fill(false)
  );
  const [checkedAll, setCheckedAll] = useState(false);
  const [spinTitle, setSpinTitle] = useState(
    new Array(parseInt(spinNum.value)).fill("")
  );
  const [spinContent, setSpinContent] = useState(
    new Array(parseInt(spinNum.value)).fill("")
  );
  const [spinWords, setSpinWords] = useState(
    new Array(parseInt(spinNum.value)).fill("")
  );
  const [editorInstance, setEditorInstance] = useState(
    new Array(parseInt(spinNum.value)).fill("")
  );
  const [collapse, setCollapse] = useState(
    new Array(parseInt(spinNum.value)).fill(false)
  );
  const [confirmAdd, setConfirmAdd] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);

  const { data, isLoading } = useGetFetch(
    PostURL.getPostSpinner(postId, spinNum.value)
  );

  useEffect(() => {
    if (data) {
      const updatedSpinTitle = data.map((item, index) => {
        return item.spinTitle;
      });
      const updatedSpinContent = data.map((item, index) => {
        return item.spinContent;
      });
      const updatedSpinWords = data.map((item, index) => {
        return item.spinWords;
      });
      setSpinTitle(updatedSpinTitle);
      setSpinContent(updatedSpinContent);
      setSpinWords(updatedSpinWords);
    }
  }, [data]);

  const handleOnChange = (position) => {
    if (checkedAll) {
      setCheckedAll(!checkedAll);
    }

    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);

    if (updatedCheckedState.every((item) => item)) {
      //Check if all checkboxes are selected
      setCheckedAll(true);
    }
  };

  const handleCheckedAll = () => {
    var isCheckedAll = !checkedAll;
    setCheckedAll(!checkedAll);

    const updatedCheckedState = new Array(parseInt(spinNum.value)).fill(
      isCheckedAll
    );
    setCheckedState(updatedCheckedState);
  };

  const handleSpinTitle = (e, position) => {
    const updatedSpinTitle = [...spinTitle];
    updatedSpinTitle[position] = e.target.value;
    setSpinTitle(updatedSpinTitle);
  };

  const handleSpinContent = (data, position) => {
    const updatedSpinContent = [...spinContent];
    updatedSpinContent[position] = data;
    setSpinContent(updatedSpinContent);
  };

  const toggleConfirmAdd = () => {
    setConfirmAdd(!confirmAdd);
  };

  const GetScorePost = async (e) => {
    e.preventDefault();
    var postContentList = spinContent.map((item) => item);
    postContentList.unshift(originContent); // Add origin post at the beginning of an array
    const postData = {
      postContentList,
    };
    const postResult = await usePostFetch(
      PostURL.scorePost,
      "POST",
      null,
      postData,
      null,
      null,
      setIsPending
    );
    if (postResult && postResult.code === 200) {
      var data = postResult.data;
      // console.log(data);
      setScoreOriginResult(data.shift()); // remove first element in array

      var sortScoreByDesc = data.sort((a, b) => {
        return b[1] - a[1];
      });
      // console.log(sortScoreByDesc);
      var spinPost = [];
      for (var i = 0; i < spinNum.value; i++) {
        spinPost.push({
          spinTitle: spinTitle[i],
          spinContent: spinContent[i],
        });
      }

      var updatedScoreResult = spinPost.sort((a, b) => {
        return (
          sortScoreByDesc[0].indexOf(b.spinContent) -
          sortScoreByDesc[0].indexOf(a.spinContent)
        );
      });
      // console.log(updatedScoreResult);
      setScoreResult(data);
      setSpinTitle(updatedScoreResult.map((item) => item.spinTitle));
      var updatedSpinContent = updatedScoreResult.map(
        (item) => item.spinContent
      );
      setSpinContent(updatedSpinContent);
      updatedSpinContent.forEach((item, index) =>
        editorInstance[index].setData(item)
      );
    }
  };

  const handleCollapse = (index) => {
    const updatedCollapse = [...collapse];
    updatedCollapse[index] = !collapse[index];
    setCollapse(updatedCollapse);
  };

  const tickFormatter = (value) => {
    const limit = 4; // put your maximum character
    if (!value) return;
    if (value.length < limit) return value;
    return `${value.substring(0, limit)}...`;
  };

  return (
    <>
      {(isLoading || isPending) && <LoadingIndicator />}
      {data && (
        <form onSubmit={(e) => GetScorePost(e)}>
          <hr className="hr-text" data-content="CHỌN BÀI VIẾT SPIN THÍCH HỢP" />
          <div className="row">
            <div className="col-12">
              <input
                type="checkbox"
                style={{ transform: "scale(1.5)" }}
                id="checkbox-all"
                className="mr-2"
                checked={checkedAll}
                onChange={handleCheckedAll}
              />
              <label htmlFor="checkbox-all">Tất cả</label>
            </div>
          </div>
          <div className="row">
            <button className="btn btn-success" type="submit">
              <i className="fa fa-check-circle mr-2" />
              Chấm điểm bài viết
            </button>
          </div>
          <hr />
        </form>
      )}
      {data &&
        data.map((item, index) => {
          return (
            <div className="row" key={`${item.spinTitle} - ${index + 1}`}>
              <div className="col-1 d-flex align-items-center">
                <input
                  type="checkbox"
                  style={{ transform: "scale(1.5)" }}
                  id={`checkbox-${index}`}
                  checked={checkedState[index]}
                  onChange={() => handleOnChange(index)}
                />
              </div>
              <div className="col-11 card shadow mb-4" style={{ padding: "0" }}>
                <div
                  className="card-header"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCollapse(index)}
                >
                  <div className="row">
                    <div className="col-xl-11 col-8">
                      <b>Bài viết spin {index + 1}</b>
                      <div className="d-flex just-content-between mt-2">
                        <p>
                          Các từ thay đổi:{" "}
                          <mark style={{ backgroundColor: "#fdfd77" }}>
                            Highlight màu vàng
                          </mark>
                        </p>
                      </div>
                    </div>
                    <div
                      className="col-xl-1 col-4 text-center"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {/* {scoreResult && (
                        <div
                          className="circle"
                          data-tip={scoreResult[index][1].toPrecision(4)}
                        >
                          {tickFormatter(scoreResult[index][1].toPrecision(4))}
                        </div>
                      )} */}
                      <i
                        className={
                          !collapse[index]
                            ? "fa fa-arrow-down ml-2 rotate-down"
                            : "fa fa-arrow-down ml-2 rotate-collapse-icon"
                        }
                      ></i>
                      <ReactTooltip />
                    </div>
                  </div>
                </div>
                {!collapse[index] && (
                  <div className="card-body">
                    <div
                      className="form-group row"
                      style={{ padding: "0 1rem" }}
                    >
                      <label>Tiêu đề</label>
                      <input
                        type="text"
                        className="form-control"
                        value={spinTitle[index]}
                        onChange={(e) => handleSpinTitle(e, index)}
                      />
                    </div>

                    <CKEditor
                      // editor={ClassicEditor}
                      editor={Editor}
                      data={item.spinContent}
                      onReady={(editor) => {
                        editor.editing.view.change((writer) => {
                          writer.setStyle(
                            "height",
                            "500px",
                            editor.editing.view.document.getRoot()
                          );
                        });
                        const updatedEditorInstance = [...editorInstance];
                        updatedEditorInstance[index] = editor;
                        setEditorInstance(updatedEditorInstance);
                      }}
                      onChange={(event, editor) => {
                        // console.log({ event, editor, data });
                        const data = editor.getData();
                        handleSpinContent(data, index);
                      }}
                      onBlur={(event, editor) => {
                        // console.log("Blur.", editor);
                      }}
                      onFocus={(event, editor) => {
                        // console.log("Focus.", editor);
                      }}
                      config={{
                        htmlSupport: {
                          allow: [
                            {
                              name: /.*/,
                              attributes: true,
                              classes: true,
                              styles: true,
                            },
                          ],
                        },
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}

      {data && (
        <>
          <div className="form-group row mt-2 float-right">
            <button
              form="spin-form"
              type="button"
              className="btn btn-primary mr-2"
              onClick={toggleConfirmAdd}
            >
              Lưu
            </button>
            <Link to="/post">
              <button type="button" className="btn btn-dark mr-2">
                Quay lại
              </button>
            </Link>
          </div>
        </>
      )}

      <ConfirmAddSpinPost
        isOpen={confirmAdd}
        toggle={toggleConfirmAdd}
        postId={postId}
        checkedState={checkedState}
        spinTitle={spinTitle}
        spinContent={spinContent}
      />
    </>
  );
};

export default GetSpinPost;
