import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ScheduleURL } from "../../Constants/ScheduleURL";
import useGetFetch from "../../Hook/useGetFetch";
import LoadingIndicator from "../LoadingIndicator";
import RedirectTo404 from "../RedirectTo404";
import ResultDetails from "./ResultDetails";

const ScheduleDetails = () => {
  const { schedule_id } = useParams();

  const [statusHtml, setStatusHtml] = useState(null);

  const { data: schDetails, isLoading } = useGetFetch(
    ScheduleURL.getDetails(schedule_id)
  );

  useEffect(() => {
    if (!schDetails) return;

    const statusHtmlList = {
      "Đang thực hiện": (
        <i
          className="fas fa-ellipsis-h fa-2x fa-fw"
          style={{ verticalAlign: "middle" }}
        ></i>
      ),
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
      "Đã huỷ": (
        <i
          className="fas fa-times-circle fa-2x fa-fw"
          style={{ color: "red", verticalAlign: "middle" }}
        ></i>
      ),
    };
    setStatusHtml(statusHtmlList[`${schDetails.status}`]);
  }, [schDetails]);

  return (
    <>
      {isLoading ? <LoadingIndicator /> : !schDetails && <RedirectTo404 />}
      {schDetails && (
        <div id="wrapper" className="content--custom">
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <h5 className="ml-3 font-weight-bold text-primary">
                CHI TIẾT LẬP LỊCH
                <Link to="/schedule">
                  <button type="button" className="close mr-4">
                    x
                  </button>
                </Link>
              </h5>
              <h4 className="m-3 text-center font-italic">
                {statusHtml}
                {`Lập lịch ${schDetails.status}`}
              </h4>

              <hr />
              <div className="row m-3">
                <p className="col-sm-2">Ngày lập lịch tự động:</p>
                <p className="col-sm-8 text-center font-weight-bold">
                  {new Date(schDetails.date).toLocaleString("en-GB")}
                </p>
              </div>
              <div className="row m-3">
                <p className="col-sm-2">Người tạo:</p>
                <p className="col-sm-8 text-center">{schDetails.author.name}</p>
              </div>
              <div className="row m-3">
                <p className="col-sm-2">Bài viết:</p>
                <div className="col-sm-8 text-center">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`/edit-post/${schDetails.post_info._id}`}
                  >
                    {schDetails.post_info.title}
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
                    href={`/site-detail/${schDetails.sat_site._id}`}
                  >
                    {schDetails.sat_site.name}
                  </a>
                  {" - "}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={schDetails.site_acc_info.site_detail.url}
                  >
                    {schDetails.site_acc_info.site_detail.url}
                  </a>
                </span>
              </div>
              <div className="form-group row m-3">
                <p className="col-sm-2">Tài khoản:</p>
                <p className="col-sm-8 text-center">
                  {schDetails.site_acc_info.username}
                </p>
              </div>
              <div className="form-group row m-3">
                <p className="col-sm-2">Đăng bài viết lên site tầng 3:</p>
                <div className="col-sm-8 text-center">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={schDetails.accept_site_lv3}
                      disabled
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
              {schDetails.accept_site_lv3 && (
                <div className="form-group row m-3">
                  <p className="col-sm-2">Dịch bài viết sang tiếng Anh:</p>
                  <div className="col-sm-8 text-center">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={schDetails.accept_translate}
                        disabled
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
              )}
              {schDetails.result && (
                <>
                  <hr className="hr-text" data-content="KẾT QUẢ ĐĂNG" />
                  <ResultDetails result={JSON.parse(schDetails.result)} />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ScheduleDetails;
