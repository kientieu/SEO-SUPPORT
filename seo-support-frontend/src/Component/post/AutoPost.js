import { useEffect, useState } from "react";
import { PostURL } from "../../Constants/PostURL";
import PostList from "./PostList";
// import AddSchedulePost from "./AddSchedulePost";
import useGetFetch from "../../Hook/useGetFetch";
import LoadingIndicator from "../LoadingIndicator";
import Select from "react-select";
import { useLocation } from "react-router-dom";

const AutoPost = () => {
  const location = useLocation();

  const customSelectStyles = {
    // Fix the overlapping problem of the Select component
    menu: (provided) => ({ ...provided, zIndex: 9999 }),
  };

  const [onAction, setOnAction] = useState(false);
  // const [selectPost, setSelectPost] = useState("");
  const [addScheduleScreen, setAddScheduleScreen] = useState(false);
  const [oriPostOpts, setOriPostOpts] = useState(null);
  const [selectedOriPost, setSelectedOriPost] = useState(location.fromPost ? location.fromPost : "");

  const { data: spinPosts, isLoading } = useGetFetch(
    selectedOriPost && selectedOriPost.value
      ? PostURL.getSpinPostsByOriginId(selectedOriPost.value)
      : PostURL.getSpinPosts,
    null,
    onAction
  );

  const { data: originPosts, isLoading1 } = useGetFetch(
    PostURL.getOriginPosts,
    null,
    onAction
  );

  useEffect(() => {
    if (originPosts) {
      const toSelectOption = ({ _id, title }) => ({
        label: `${_id} - ${title}`,
        value: _id,
      });
      setOriPostOpts(originPosts.map(toSelectOption));
    }
  }, [originPosts]);

  function toggleAddSchedule() {
    setAddScheduleScreen(!addScheduleScreen);
  }

  return (
    <>
      {!addScheduleScreen ? (
        <div id="wrapper" className="content--custom">
          {/* Sidebar */}

          {/* Content Wrapper */}
          <div id="content-wrapper" className="d-flex flex-column">
            {/* Main Content */}
            <div id="content">
              {isLoading && isLoading1 && <LoadingIndicator />}

              <div className="container-fluid">
                {/* Page Heading */}
                <h3 className="mb-2 font-weight-bold text-center">
                  DANH SÁCH BÀI VIẾT TỰ ĐỘNG
                </h3>

                <div className="card shadow mb-4">
                  <div className="card-header py-3">
                    <p>
                      <strong>Bài viết gốc</strong>
                    </p>
                    {originPosts && (
                      <Select
                        isClearable
                        options={oriPostOpts}
                        value={selectedOriPost}
                        onChange={(option) => setSelectedOriPost(option)}
                        styles={customSelectStyles}
                      />
                    )}
                  </div>
                  <div className="card-body">
                    {spinPosts && (
                      <PostList
                        posts={spinPosts}
                        onAction={onAction}
                        setOnAction={setOnAction}
                        toggleAddSchedule={toggleAddSchedule}
                        // setSelectPost={setSelectPost}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* End of Main Content */}
          </div>
          {/* End of Content Wrapper */}
        </div>
      ) : (
        // <AddSchedulePost
        //   toggleAddSchedule={toggleAddSchedule}
        //   selectPost={selectPost}
        // />
        <></>
      )}
    </>
  );
};

export default AutoPost;
