import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { PostURL } from "../../Constants/PostURL";
import { SatSiteURL } from "../../Constants/SatSiteURL";
import useGetFetch from "../../Hook/useGetFetch";
import usePostFetch from "../../Hook/usePostFetch";
import LoadingIndicator from "../LoadingIndicator";
import LatinizeString from "../../Services/LatinizeString";

import "./css/select-site.css";
import RedirectTo404 from "../RedirectTo404";

const SelectSiteS3 = ({
  setStep1,
  setStep2,
  setStep3,
  finalDetail,
  setFinalDetail,
  setResult,
}) => {
  const { post_id } = useParams();
  const search = useLocation().search;
  const satSiteId = new URLSearchParams(search).get("site");

  const [isPending, setIsPending] = useState(false);
  const [switchBtn, setSwitchBtn] = useState(false);

  const { data: postDetails, isLoading } = useGetFetch(
    PostURL.getDetails(post_id)
  );

  const isBackOnClick = () => {
    setStep2(false);
  };

  const PostToSite = async (e) => {
    e.preventDefault();
    const postInfo = {
      postId: postDetails._id,
      satSiteId: finalDetail.satSiteId,
      siteAccId: finalDetail.siteAccId,
      siteLv2Url: finalDetail.siteLv2Url,
      acceptTranslate: switchBtn,
    };

    let siteName = finalDetail.siteName.replace(/\s/g, "");
    siteName = siteName.toLowerCase();
    siteName = LatinizeString.latinize(siteName);

    const result = await usePostFetch(
      SatSiteURL.postToSite(siteName, finalDetail.siteLevel),
      "POST",
      null,
      postInfo,
      null,
      null,
      setIsPending
    );
    if (result) {
      setResult(result);
      setStep3(true);
    }
  };

  return (
    <>
      {isLoading || isPending ? (
        <LoadingIndicator />
      ) : (
        !postDetails && <RedirectTo404 />
      )}
      <div className="card shadow mb-4">
        <form id="post-to-site-form" onSubmit={(e) => PostToSite(e)}>
          <div className="form-group row m-3">
            <p className="col-sm-2">Tên Site vệ tinh:</p>
            <p className="col-sm-8 text-center">{finalDetail.siteName}</p>
          </div>
          <div className="form-group row m-3">
            <p className="col-sm-2">URL:</p>
            <a
              target="_blank"
              rel="noreferrer"
              href={finalDetail.siteUrl}
              className="col-sm-8 text-center"
            >
              {finalDetail.siteUrl}
            </a>
          </div>
          <div className="form-group row m-3">
            <p className="col-sm-2">Tài khoản:</p>
            <p className="col-sm-8 text-center">{finalDetail.siteAcc}</p>
          </div>
          {postDetails && (
            <>
              <div className="form-group row m-3">
                <p className="col-sm-2">Tiêu đề bài viết:</p>
                <a
                  className="col-sm-8 text-center"
                  href={`/edit-post/${postDetails._id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {postDetails.title}
                </a>
              </div>
              <div className="form-group row m-3">
                <p className="col-sm-2">Từ khoá:</p>
                <p className="col-sm-8 text-center">
                  {postDetails.keyword.name}
                </p>
              </div>
              <div className="form-group row m-3">
                <p className="col-sm-2">Landing page:</p>
                <a
                  className="col-sm-8 text-center"
                  href={postDetails.landing_page.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {postDetails.landing_page.url}
                </a>
              </div>
              <div className="form-group row m-3">
                <p className="col-sm-2">Dịch bài viết sang tiếng Anh:</p>
                <div className="col-sm-8 text-center">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={switchBtn}
                      onChange={() => setSwitchBtn(!switchBtn)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
      <div className="row mt-2 float-right">
        {isPending ? (
          <>
            <button
              type="button"
              className="btn btn-dark mr-2"
              onClick={isBackOnClick}
              disabled
            >
              <span>Quay lại</span>
            </button>
            <button
              type="submit"
              form="post-to-site-form"
              className="btn btn-primary"
            >
              Đang xử lý...
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-dark mr-2"
              onClick={isBackOnClick}
            >
              <Link
                to={`/post/back-link-lv3/${post_id}?site=${satSiteId}`}
                style={{ textDecoration: "none", color: "white" }}
              >
                Quay lại
              </Link>
            </button>
            <button
              type="submit"
              form="post-to-site-form"
              className="btn btn-primary"
            >
              Đăng bài
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default SelectSiteS3;
