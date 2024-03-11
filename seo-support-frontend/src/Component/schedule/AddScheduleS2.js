import { useState } from "react";
import usePostFetch from "../../Hook/usePostFetch";
import { ScheduleURL } from "../../Constants/ScheduleURL";
import LoadingIndicator from "../LoadingIndicator";
import AddSchResult from "./AddSchResult";

const AddScheduleS2 = ({
  setStep1,
  setStep2,
  finalDetail,
  toggleAddSchedule,
  onAction,
  setOnAction,
}) => {
  const [isPending, setIsPending] = useState(false);
  const [infoModal, setInfoModal] = useState(false);
  const [switchSiteLv3, setSwitchSiteLv3] = useState(false);
  const [switchAcceptTranslate, setSwitchAcceptTranslate] = useState(false);
  const [addSchResult, setAddSchResult] = useState(null);

  const isBackOnClick = () => {
    setStep1(false);
  };

  const AddSchedule = async (e) => {
    e.preventDefault();

    var splitDate = finalDetail.selectDate.split("/");
    var splitTime = finalDetail.selectTime.split(":");
    // new Date(year, month, day, hour, minute)
    var schDate = new Date(
      splitDate[2],
      parseInt(splitDate[1]) - 1,
      splitDate[0],
      splitTime[0],
      splitTime[1]
    );

    const scheduleInfo = {
      schDate,
      satSiteId: finalDetail.selectSite.value,
      siteAccId: finalDetail.selectAcc.value,
      postId: finalDetail.selectPost.value,
      acceptSiteLv3: switchSiteLv3,
      acceptTranslate: switchAcceptTranslate,
    };
    const result = await usePostFetch(
      ScheduleURL.getAddAutoSch,
      "POST",
      null,
      scheduleInfo,
      onAction,
      setOnAction,
      setIsPending
    );

    if (result) {
      setAddSchResult(result);
      toggleInfoModal();
    }
  };

  const toggleInfoModal = () => {
    setInfoModal(!infoModal);
  };

  return (
    <>
      {isPending && <LoadingIndicator />}
      <div className="card shadow mb-4">
        <form id="add-schedule-form" onSubmit={(e) => AddSchedule(e)}>
          <div className="form-group row m-3">
            <p className="col-sm-2">Bài viết:</p>
            <a
              className="col-sm-8 text-center"
              target="_blank"
              rel="noreferrer"
              href={`/edit-post/${finalDetail.selectPost.value}`}
            >
              {finalDetail.selectPost.label.split("-")[1]}
            </a>
          </div>
          <div className="form-group row m-3">
            <p className="col-sm-2">Thời gian đăng:</p>
            <p className="col-sm-8 text-center font-weight-bold">{`${finalDetail.selectDate}, ${finalDetail.selectTime}`}</p>
          </div>
          <hr className="hr-text" data-content="THÔNG TIN SITE VỆ TINH" />
          <div className="form-group row m-3">
            <p className="col-sm-2">URL site vệ tinh:</p>
            <a
              target="_blank"
              rel="noreferrer"
              href={finalDetail.selectSiteDetail.label}
              className="col-sm-8 text-center"
            >
              {finalDetail.selectSiteDetail.label}
            </a>
          </div>
          <div className="form-group row m-3">
            <p className="col-sm-2">Tài khoản:</p>
            <p className="col-sm-8 text-center">
              {finalDetail.selectAcc.label}
            </p>
          </div>
          <div className="form-group row m-3">
            <p className="col-sm-2">Đăng bài viết lên site tầng 3:</p>
            <div className="col-sm-8 text-center">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={switchSiteLv3}
                  onChange={() => setSwitchSiteLv3(!switchSiteLv3)}
                />
                <span className="slider round"></span>
              </label>
              <div className="text-center font-italic">
                Lưu ý: Site vệ tinh tầng 3 sẽ được lấy ngẫu nhiên để đăng
              </div>
            </div>
          </div>
          {switchSiteLv3 && (
            <div className="form-group row m-3">
              <p className="col-sm-2">Dịch bài viết sang tiếng Anh:</p>
              <div className="col-sm-8 text-center">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={switchAcceptTranslate}
                    onChange={() =>
                      setSwitchAcceptTranslate(!switchAcceptTranslate)
                    }
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          )}
        </form>
      </div>
      <div className="row mt-2 float-right">
        <button
          type="button"
          className="btn btn-dark mr-2"
          onClick={isBackOnClick}
        >
          <span>Quay lại</span>
        </button>
        {isPending ? (
          <button
            type="button"
            form="post-to-site-form"
            className="btn btn-primary"
          >
            Đang xử lý...
          </button>
        ) : (
          <button
            type="submit"
            form="add-schedule-form"
            className="btn btn-primary"
          >
            Xác nhận
          </button>
        )}
      </div>
      {addSchResult && (
        <AddSchResult
          isOpen={infoModal}
          toggle={toggleInfoModal}
          addSchResult={addSchResult}
          toggleAddSchedule={toggleAddSchedule}
          setStep2={setStep2}
        />
      )}
    </>
  );
};

export default AddScheduleS2;
