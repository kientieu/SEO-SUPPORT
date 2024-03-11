import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { KeywordURL } from "../../Constants/KeywordURL";
import { TopicURL } from "../../Constants/TopicURL";
import { PostURL } from "../../Constants/PostURL";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import AsyncSelect from "react-select/async";
import Select from "react-select";
import useGetFetch from "../../Hook/useGetFetch";
import LoadingIndicator from "../LoadingIndicator";
import ConfirmAddModal from "./ConfirmAddModal";
import ConfirmUnsaveModal from "./ConfirmUnsaveModal";
import { checkInputInfo } from "./CheckInputInfo";
import ValEditPostModal from "./ValEditPostModal";
import RedirectTo404 from "../RedirectTo404";

const EditPost = () => {
  const { post_id } = useParams();

  const customSelectStyles = {
    // Fix the overlapping problem of the Select component
    menu: (provided) => ({ ...provided, zIndex: 9999 }),
  };

  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [selectedKw, setSelectedKw] = useState(null);
  const [topicOpts, setTopicOpts] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [isOptLoading, setIsOptLoading] = useState(false);
  const [lPOpts, setLPOpts] = useState([]);
  const [isLPLoading, setIsLPLoading] = useState(false);
  const [selectedLP, setSelectedLP] = useState(null);
  const [confirmAddModal, setConfirmAddModal] = useState(false);
  const [confirmUnsaveModal, SetConfirmUnsaveModal] = useState(false);
  const [error, setError] = useState([]);
  const [warning, setWarning] = useState([]);
  const [valEditPost, setValEditPost] = useState(false);
  const [putData, setPutData] = useState(null);

  const { data: postDetails, isLoading } = useGetFetch(
    PostURL.getDetails(post_id)
  );
  const { data: postExistSch, isLoading: isLoading1 } = useGetFetch(
    PostURL.checkPostExistSch(post_id)
  );

  useEffect(() => {
    if (!isLoading && postDetails) {
      setPostTitle(postDetails.title);
      setPostContent(postDetails.content);
      setSelectedTopic({
        label: postDetails.topic.name,
        value: postDetails.topic._id,
      });
      setSelectedKw({
        label: postDetails.keyword.name,
        value: postDetails.keyword._id,
      });
      setSelectedLP({
        label: `${postDetails.landing_page.campaign.name} - ${postDetails.landing_page.url}`,
        value: postDetails.landing_page._id,
      });
    }
  }, [isLoading, postDetails]);

  const filterOptions = (options, inputValue) => {
    const candidate = inputValue.toLowerCase();
    return options.filter(({ label }) =>
      label.toLowerCase().trim().includes(candidate)
    );
  };

  const loadKwOptions = (inputValue, callback) => {
    var token = localStorage.getItem("token");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    fetch(KeywordURL.getSearch(inputValue), requestOptions)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data && data.code === 200) {
          const keywords = data.data;
          const toSelectOption = ({ _id, name }) => ({
            label: name,
            value: _id,
          });

          // map server data to options
          const asyncOptions = keywords.map(toSelectOption);

          // Filter options if needed
          const filtered = filterOptions(asyncOptions, inputValue);

          // Call callback with mapped and filtered options
          callback(filtered);
        }
      });
  };

  const handleKwSelect = (option, { action }) => {
    switch (action) {
      case "menu-close":
        return;
      case "clear":
        setSelectedKw(null);
        setSelectedLP(null);
        return;
      case "select-option":
        if (option) {
          setSelectedKw(option);
          setSelectedLP(null);
        }
        return;
      default:
        return;
    }
  };

  function getTopicAsync() {
    setIsOptLoading(true);
    var token = localStorage.getItem("token");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    fetch(TopicURL.getAdd, requestOptions)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data && data.code === 200) {
          const topics = data.data;
          const toSelectOption = ({ _id, name }) => ({
            label: name,
            value: _id,
          });

          setTopicOpts(topics.map(toSelectOption));
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsOptLoading(false));
  }

  const handleTopicSelect = (option, { action }) => {
    switch (action) {
      case "menu-close":
        return;
      case "clear":
        setSelectedTopic(null);
        return;
      case "select-option":
        if (option) setSelectedTopic(option);
        return;
      default:
        return;
    }
  };

  const loadLPOptions = () => {
    setIsLPLoading(true);
    var token = localStorage.getItem("token");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    fetch(KeywordURL.getEditDetails(selectedKw.value), requestOptions)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data && data.code === 200) {
          const kwDetails = data.data;
          const toSelectOption = ({ _id, url, campaign }) => ({
            label: `${campaign.name} - ${url}`,
            value: _id,
          });
          let lpContainKW = kwDetails.lpContainKW.filter(
            (item) => !item.isLock
          );
          setLPOpts(lpContainKW.map(toSelectOption));
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLPLoading(false));
  };

  function isPostExistSch() {
    if (postExistSch) {
      return true;
    }
    return false;
  }

  const toggleConfirmAddModal = (e) => {
    e.preventDefault();
    setConfirmAddModal(!confirmAddModal);
  };

  const toggleConfirmUnsaveModal = () => {
    SetConfirmUnsaveModal(!confirmUnsaveModal);
  };

  const handlePostToSiteOnClick = () => {
    toggleConfirmUnsaveModal();
  };

  const isInputNotFilled = () => {
    if (postTitle && selectedTopic && selectedKw && selectedLP && postContent) {
      return false;
    }
    return true;
  };

  const handleUpdateOnClick = () => {
    handleCheckInput();
  };

  function handleCheckInput() {
    var [errorMsg, warningMsg] = checkInputInfo(
      postTitle,
      postContent,
      selectedKw
    );
    setError(errorMsg);
    setWarning(warningMsg);
    setPutData({
      postTitle,
      postContent,
      postTopic: selectedTopic.value,
      keyword: selectedKw.value,
      landingPage: selectedLP.value,
    });
    toggleValEditPost();
  }

  const toggleValEditPost = () => {
    setValEditPost(!valEditPost);
  };

  return (
    <div id="wrapper" className="content--custom">
      {/* Sidebar */}
      {/* <Navbar /> */}

      {/* Content Wrapper */}
      <div id="content-wrapper" className="d-flex flex-column ">
        {/* Main Content */}
        <div id="content">
          {/* <Topbar /> */}

          {isLoading || isLoading1 || isPending ? (
            <LoadingIndicator />
          ) : (
            !postDetails && <RedirectTo404 />
          )}

          <div className="container-fluid">
            {/* Page Heading */}
            <h5 className="font-weight-bold text-primary">CHI TIẾT BÀI VIẾT</h5>

            <div className="card-body">
              <div className="form-group">
                <label>Tiêu đề</label>
                <input
                  maxLength={100}
                  type="text"
                  required
                  className="form-control"
                  id="exampleFormControlInput1"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                />
              </div>

              <div className="form-group row">
                <label className="col-sm-2 ">Chủ đề</label>
                <div className="col-sm-10 ">
                  <Select
                    isClearable
                    options={topicOpts}
                    onFocus={getTopicAsync}
                    isLoading={isOptLoading}
                    value={selectedTopic}
                    onChange={handleTopicSelect}
                    styles={customSelectStyles}
                  />
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2 ">Từ khoá</label>
                <div className="col-sm-10">
                  <AsyncSelect
                    key={JSON.stringify(isPending)}
                    cacheOptions
                    loadOptions={loadKwOptions}
                    defaultOptions
                    isClearable
                    value={selectedKw}
                    onChange={handleKwSelect}
                    styles={customSelectStyles}
                  />
                </div>
              </div>

              <div className="form-group row">
                <label className="col-sm-2">Landing page</label>
                <div className="col-sm-10">
                  <Select
                    options={lPOpts}
                    onFocus={loadLPOptions}
                    isLoading={isLPLoading}
                    isDisabled={!selectedKw ? true : false}
                    isClearable
                    value={selectedLP}
                    onChange={(option, e) => setSelectedLP(option)}
                    styles={customSelectStyles}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="exampleFormControlTextarea1">Nội dung</label>
                <CKEditor
                  // editor={ClassicEditor}
                  editor={Editor}
                  data={postContent}
                  onReady={(editor) => {
                    // You can store the "editor" and use when it is needed.
                    // console.log("Editor is ready to use!", editor);
                    editor.editing.view.change((writer) => {
                      writer.setStyle(
                        "height",
                        "500px",
                        editor.editing.view.document.getRoot()
                      );
                    });
                  }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    // console.log({ event, editor, data });
                    setPostContent(data);
                  }}
                  onBlur={(event, editor) => {
                    // console.log("Blur.", editor);
                  }}
                  onFocus={(event, editor) => {
                    // console.log("Focus.", editor);
                  }}
                />
              </div>

              <div className="form-group row mt-2 float-right">
                <button
                  type="button"
                  className="btn btn-warning mr-4"
                  disabled={isPending}
                  onClick={handlePostToSiteOnClick}
                  style={{ color: "black" }}
                >
                  Đăng lên site vệ tinh
                </button>
                {isPending ? (
                  <button
                    type="button"
                    className="btn btn-primary mr-2"
                    disabled
                  >
                    Đang cập nhật...
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary mr-2"
                    disabled={isInputNotFilled()}
                    onClick={handleUpdateOnClick}
                  >
                    Cập nhật
                  </button>
                )}
                <Link to="/post">
                  <button
                    type="button"
                    className="btn btn-dark mr-2"
                    disabled={isPending}
                  >
                    Huỷ
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* End of Main Content */}
      </div>
      {/* End of Content Wrapper */}

      <ConfirmAddModal
        isOpen={confirmAddModal}
        toggle={toggleConfirmAddModal}
        data={{
          postId: post_id,
          postTitle,
          postContent,
          selectedTopic,
          selectedKw,
          selectedLP,
        }}
      />

      <ConfirmUnsaveModal
        isOpen={confirmUnsaveModal}
        toggle={toggleConfirmUnsaveModal}
        postId={post_id}
      />

      <ValEditPostModal
        isOpen={valEditPost}
        toggle={toggleValEditPost}
        error={error}
        warning={warning}
        post_id={post_id}
        editedPost={putData}
        setIsPending={setIsPending}
        isPostExistSch={isPostExistSch}
        toggleConfirmAddModal={toggleConfirmAddModal}
      />
    </div>
  );
};

export default EditPost;
