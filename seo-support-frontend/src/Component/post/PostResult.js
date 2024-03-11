import { ScheduleURL } from "../../Constants/ScheduleURL";
import PostResultList from "./PostResultList";
import useGetFetch from "../../Hook/useGetFetch";
import LoadingIndicator from "../LoadingIndicator";

const PostResult = () => {
  const { data: results, isLoading } = useGetFetch(ScheduleURL.getManualSch);

  return (
    <>
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
                DANH SÁCH KẾT QUẢ ĐĂNG BÀI THỦ CÔNG
              </h3>

              <div className="card shadow mb-4">
                <div className="card-header py-3"></div>
                <div className="card-body">
                  {results && <PostResultList results={results} />}
                </div>
              </div>
            </div>
          </div>
          {/* End of Main Content */}
        </div>
        {/* End of Content Wrapper */}
      </div>
    </>
  );
};

export default PostResult;
