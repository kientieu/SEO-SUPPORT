import { useEffect, useState } from "react";
import Select from "react-select";
import { PostURL } from "../../Constants/PostURL";
import { SatSiteURL } from "../../Constants/SatSiteURL";
import useGetFetch from "../../Hook/useGetFetch";
import AddSchS1SiteDetail from "./AddSchS1SiteDetail";
import Datetime from "react-datetime";
import moment from "moment";

import "react-datetime/css/react-datetime.css";

const AddScheduleS1 = ({ setStep1, finalDetail, setFinalDetail }) => {
  const [postOpts, setPostOpts] = useState([]);
  const [selectPost, setSelectPost] = useState(
    finalDetail ? finalDetail.selectPost : ""
  );
  const [siteOpts, setSiteOpts] = useState([]);
  const [selectSite, setSelectSite] = useState(
    finalDetail ? finalDetail.selectSite : ""
  );
  const [selectSiteDetail, setSelectSiteDetail] = useState(
    finalDetail ? finalDetail.selectSiteDetail : ""
  );
  const [selectAcc, setSelectAcc] = useState(
    finalDetail ? finalDetail.selectAcc : ""
  );
  const [accPwd, setAccPwd] = useState(finalDetail ? finalDetail.accPwd : "");
  const [selectDate, setSelectDate] = useState(
    finalDetail
      ? finalDetail.selectDate
      : moment(new Date()).format("DD/MM/YYYY")
  );
  const [selectTime, setSelectTime] = useState(
    finalDetail ? finalDetail.selectTime : "00:00"
  );
  const [timeErr, setTimeErr] = useState("");

  const customSelectStyles = {
    // Fix the overlapping problem of the Select component
    menu: (provided) => ({ ...provided, zIndex: 9999 }),
  };

  const { data: posts, isLoading: isPostLoading } = useGetFetch(PostURL.getAdd);
  const { data: satSites, isLoading: isSiteLoading } = useGetFetch(
    SatSiteURL.getAddSatSite
  );

  const setPostOptions = () => {
    const toSelectOption = ({ _id, title }) => ({
      label: `${_id} - ${title}`,
      value: _id,
    });
    setPostOpts(posts.map(toSelectOption));
  };

  const setSiteOptions = () => {
    const toSelectOption = ({ _id, name, url }) => ({
      label: `${name} - ${url}`,
      value: _id,
    });
    var siteLv2 = satSites.filter((item) => item.level === 2);
    setSiteOpts(siteLv2.map(toSelectOption));
  };

  const selectSiteHandler = (option) => {
    setSelectSite(option);
    setSelectSiteDetail("");
  };

  var yesterday = moment().subtract(1, "day");
  function blockPassedDate(current) {
    return current.isAfter(yesterday);
  }

  useEffect(() => {
    if (selectAcc !== "") {
      setFinalDetail({
        selectPost,
        selectSite,
        selectSiteDetail,
        selectAcc,
        accPwd,
        selectDate,
        selectTime,
      });
    }
  }, [
    selectPost,
    selectSite,
    selectSiteDetail,
    selectAcc,
    accPwd,
    selectDate,
    selectTime,
    setFinalDetail,
  ]);

  const isNextOnClick = () => {
    if (!isValidDateTime()) {
      return setTimeErr("Vui lòng đặt thời gian đăng trễ hơn");
    }
    setStep1(true);
  };

  function isValidDateTime() {
    var now = new Date();
    var splitDate = selectDate.split("/");
    var splitTime = selectTime.split(":");
    // new Date(year, month, day, hour, minute)
    var selectDateTime = new Date(
      splitDate[2],
      parseInt(splitDate[1]) - 1,
      splitDate[0],
      splitTime[0],
      splitTime[1]
    );

    if (selectDateTime <= now) {
      return false;
    }
    return true;
  }

  const customDateInput = (props) => {
    return (
      <div>
        <input {...props} />
        <i className={`fas fa-calendar fa-sm input-icons`}></i>
      </div>
    );
  };

  const customTimeInput = (props) => {
    return (
      <div>
        <input {...props} />
        <i className={`fas fa-clock fa-sm input-icons`}></i>
      </div>
    );
  };

  const handleTimeInput = (value) => {
    setSelectTime(moment(value).format("HH:mm"));
    setTimeErr("");
  };

  return (
    <>
      <div className="card shadow mb-4">
        <div className="row m-3">
          <label className="col-2 mt-2">
            Chọn bài viết <span className="text-danger">*</span>
          </label>
          <div className="col-10">
            <Select
              name="colors"
              options={postOpts}
              classNamePrefix="select"
              onFocus={setPostOptions}
              value={selectPost}
              onChange={(option) => setSelectPost(option)}
              isLoading={isPostLoading}
              styles={customSelectStyles}
            />
          </div>
        </div>

        <div className="row m-3">
          <label className="col-2 mt-2">
            Chọn loại site vệ tinh <span className="text-danger">*</span>
          </label>
          <div className="col-10">
            <Select
              name="colors"
              options={siteOpts}
              classNamePrefix="select"
              onFocus={setSiteOptions}
              value={finalDetail ? finalDetail.selectSite : selectSite}
              onChange={(option) => selectSiteHandler(option)}
              isLoading={isSiteLoading}
              isDisabled={selectPost === "" ? true : false}
              styles={customSelectStyles}
            />
          </div>
        </div>

        {selectSite !== "" && (
          <AddSchS1SiteDetail
            selectSite={selectSite.value}
            selectSiteDetail={selectSiteDetail}
            setSelectSiteDetail={setSelectSiteDetail}
            selectAcc={selectAcc}
            setSelectAcc={setSelectAcc}
            accPwd={accPwd}
            setAccPwd={setAccPwd}
          />
        )}

        {selectAcc !== "" && (
          <div className="row m-3">
            <label className="col-2 mt-2">
              Ngày đăng <span className="text-danger">*</span>
            </label>
            <div className="col-4">
              <Datetime
                dateFormat={"DD/MM/YYYY"}
                timeFormat={false}
                value={selectDate}
                inputProps={{ readOnly: true }}
                isValidDate={blockPassedDate}
                onChange={(value) =>
                  setSelectDate(moment(value).format("DD/MM/YYYY"))
                }
                renderInput={customDateInput}
              />
              <i className={`fas fa-canlendar fa-sm input-icons`}></i>
            </div>
            <label className="col-2 mt-2 text-center">
              Giờ đăng <span className="text-danger">*</span>
            </label>
            <div className="col-2">
              <Datetime
                dateFormat={false}
                inputProps={{ readOnly: true }}
                value={selectTime}
                timeFormat={"HH:mm"}
                timeConstraints={{ minutes: { step: 15 } }}
                onChange={(value) => handleTimeInput(value)}
                renderInput={customTimeInput}
              />
              <div className="mt-1 text-danger font-italic">{timeErr}</div>
            </div>
          </div>
        )}
      </div>
      <div className="row mt-2 float-right">
        {finalDetail ? (
          <button
            type="button"
            className="btn btn-primary mr-2"
            onClick={isNextOnClick}
          >
            Tiếp theo
          </button>
        ) : (
          <button type="button" className="btn btn-primary mr-2" disabled>
            Tiếp theo
          </button>
        )}
      </div>
    </>
  );
};

export default AddScheduleS1;
