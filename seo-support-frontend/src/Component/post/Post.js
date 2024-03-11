import { useState } from "react";
import { Link } from "react-router-dom";
import { PostURL } from "../../Constants/PostURL";
import PostList from "./PostList";
// import AddSchedulePost from "./AddSchedulePost";
import useGetFetch from "../../Hook/useGetFetch";
import LoadingIndicator from "../LoadingIndicator";

const Post = () => {
  const [onAction, setOnAction] = useState(false);
  // const [selectPost, setSelectPost] = useState("");
  const [addScheduleScreen, setAddScheduleScreen] = useState(false);

  const { data: posts, isLoading } = useGetFetch(
    PostURL.getOriginPosts,
    null,
    onAction
  );

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
              {isLoading && <LoadingIndicator />}

              <div className="container-fluid">
                {/* Page Heading */}
                <h3 className="mb-2 font-weight-bold text-center">
                  DANH SÁCH BÀI VIẾT
                </h3>

                <div className="card shadow mb-4">
                  <div className="card-header py-3 ">
                    <div className="float-right">
                      <Link
                        to="/add-post"
                        className="btn btn-sm btn-primary shadow-sm mr-2"
                      >
                        <i className="fas fa-plus fa-sm text-white-50" /> Thêm
                        mới
                      </Link>
                    </div>
                  </div>
                  <div className="card-body">
                    {posts && (
                      <PostList
                        posts={posts}
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

export default Post;
