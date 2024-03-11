import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ScheduleURL } from "../../Constants/ScheduleURL";
import useGetFetch from "../../Hook/useGetFetch";
import LoadingIndicator from "../LoadingIndicator";
import RedirectTo404 from "../RedirectTo404";

const PostResultDetails = () => {
  const { result_id } = useParams();

  const [statusHtml, setStatusHtml] = useState(null);

  const { data: resultDetails, isLoading } = useGetFetch(
    ScheduleURL.getDetails(result_id)
  );

  useEffect(() => {
    if (!resultDetails) return;

    const statusHtmlList = {
      "Thành công": (
        <i
          className="fas fa-check-circle fa-2x fa-fw"
          style={{ color: "green", verticalAlign: "middle" }}
        ></i>
      ),
      "Thất bại": (
        <i
          className="fas fa-exclamation-circle fa-2x fa-fw"
          style={{ color: "red", verticalAlign: "middle" }}
        ></i>
      ),
    };
    setStatusHtml(statusHtmlList[`${resultDetails.status}`]);
  }, [resultDetails]);

  return (
    <>
      {isLoading ? <LoadingIndicator /> : !resultDetails && <RedirectTo404 />}
      {resultDetails && (
        <div id="wrapper" className="content--custom">
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <h5 className="ml-3 font-weight-bold text-primary">
                CHI TIẾT KẾT QUẢ
                <Link to="/post/results">
                  <button type="button" className="close mr-4">
                    x
                  </button>
                </Link>
              </h5>
              <h4 className="m-3 text-center font-italic">
                {statusHtml}
                {`Đăng bài ${resultDetails.status}`}
              </h4>
              {resultDetails.sat_site.level === 2 && resultDetails.result && (
                <div className="mt-2 text-center">
                  <Link
                    to={{
                      pathname: `/post/back-link-lv3/${resultDetails.post_info._id}`,
                      siteLv2Url: JSON.parse(resultDetails.result).data
                        .postAtSiteUrl,
                      from: `/post/results/${result_id}`,
                    }}
                  >
                    <button type="button" className="btn btn-primary">
                      Đăng lên site vệ tinh tầng 3
                    </button>
                  </Link>
                </div>
              )}

              <hr />
              <div className="row m-3">
                <p className="col-sm-2">Ngày đăng:</p>
                <p className="col-sm-8 text-center font-weight-bold">
                  {new Date(resultDetails.date).toLocaleString("en-GB")}
                </p>
              </div>
              <div className="row m-3">
                <p className="col-sm-2">Người tạo:</p>
                <p className="col-sm-8 text-center">
                  {resultDetails.author.name}
                </p>
              </div>
              <div className="row m-3">
                <p className="col-sm-2">Bài viết:</p>
                <div className="col-sm-8 text-center">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`/edit-post/${resultDetails.post_info._id}`}
                  >
                    {resultDetails.post_info.title}
                  </a>
                </div>
              </div>
              <hr className="hr-text" data-content="THÔNG TIN SITE VỆ TINH" />
              <div className="form-group row m-3">
                <p className="col-sm-2">Site vệ tinh:</p>
                <span className="col-sm-8 text-center">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`/site-detail/${resultDetails.sat_site._id}`}
                  >
                    {resultDetails.sat_site.name}
                  </a>
                  {" - "}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={resultDetails.site_acc_info.site_detail.url}
                  >
                    {resultDetails.site_acc_info.site_detail.url}
                  </a>
                  {" - "}
                  <span>Level: {resultDetails.sat_site.level}</span>
                </span>
              </div>
              <div className="form-group row m-3">
                <p className="col-sm-2">Tài khoản:</p>
                <p className="col-sm-8 text-center">
                  {resultDetails.site_acc_info.username}
                </p>
              </div>
              {resultDetails.result && (
                <>
                  <hr className="hr-text" data-content="KẾT QUẢ ĐĂNG" />
                  {JSON.parse(resultDetails.result).code !== 200 ? (
                    <>
                      <div className="row m-3">
                        <p className="col-sm-2">Lỗi:</p>
                        <p className="col-sm-8 text-center">
                          {JSON.parse(resultDetails.result).message}
                        </p>
                      </div>
                      {/* <p>{JSON.parse(resultDetails.result).error}</p> */}
                    </>
                  ) : (
                    <>
                      {JSON.parse(resultDetails.result).data.authorUrl && (
                        <div className="row m-3">
                          <p className="col-sm-2">Tác giả:</p>
                          <p className="col-sm-8 text-center">
                            {JSON.parse(resultDetails.result).data.author}
                            {" - "}
                            <a
                              target="_blank"
                              rel="noreferrer"
                              href={
                                JSON.parse(resultDetails.result).data.authorUrl
                              }
                            >
                              {JSON.parse(resultDetails.result).data.authorUrl}
                            </a>
                          </p>
                        </div>
                      )}
                      <div className="row m-3">
                        <p className="col-sm-2">
                          Link bài viết trên site vệ tinh:
                        </p>
                        <a
                          className="col-sm-8 text-center"
                          target="_blank"
                          rel="noreferrer"
                          href={
                            JSON.parse(resultDetails.result).data.postAtSiteUrl
                          }
                        >
                          {JSON.parse(resultDetails.result).data.postAtSiteUrl}
                        </a>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostResultDetails;
