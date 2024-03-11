import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SatSiteURL } from "../../Constants/SatSiteURL";
import useGetFetch from "../../Hook/useGetFetch";
import LoadingIndicator from "../LoadingIndicator";

const SelectSiteLv3S1 = ({ setStep1, finalDetail, setFinalDetail }) => {
  const { post_id } = useParams();

  const [selectSite, setSelectSite] = useState("");
  const { data: satSites, isLoading } = useGetFetch(SatSiteURL.getAddSatSite);

  const onSiteSelected = (e, site) => {
    setSelectSite(e.target.value);
    setFinalDetail({
      ...finalDetail,
      satSiteId: site._id,
      siteName: site.name,
      siteLevel: site.level,
    });
  };

  const isNextOnClick = () => {
    setStep1(true);
  };

  return (
    <>
      {isLoading && <LoadingIndicator />}
      <div className="card shadow mb-4">
        <div className="m-4">
          {satSites &&
            satSites.map((site) => {
              if (site.level === 3) {
                return (
                  <span className="row mb-2" key={`${site._id}`}>
                    <input
                      type="radio"
                      value={`${site._id}`}
                      name="siteId"
                      onChange={(e) => onSiteSelected(e, site)}
                    />
                    <span className="ml-2">{`${site.name}`}</span>
                  </span>
                );
              }
              return null;
            })}
        </div>
      </div>
      <div className="row mt-2 float-right">
        <button type="button" className="btn btn-dark mr-2">
          <Link
            to={`/edit-post/${post_id}`}
            style={{ textDecoration: "none", color: "white" }}
          >
            Quay lại
          </Link>
        </button>
        <button
          type="button"
          className="btn btn-primary mr-2"
          disabled={selectSite === "" ? true : false}
          onClick={isNextOnClick}
        >
          {selectSite === "" ? (
            <span>Tiếp theo</span>
          ) : (
            <Link
              to={`/post/back-link-lv3/${post_id}?site=${selectSite}`}
              style={{ textDecoration: "none", color: "white" }}
            >
              Tiếp theo
            </Link>
          )}
        </button>
      </div>
    </>
  );
};

export default SelectSiteLv3S1;
