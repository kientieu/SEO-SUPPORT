import { useState } from "react";
import AddScheduleS1 from "./AddScheduleS1";
import AddScheduleS2 from "./AddScheduleS2";

import "./css/add-schedule.css";

const AddSchedule = ({ toggleAddSchedule, onAction, setOnAction }) => {
  const [step1, setStep1] = useState(false);
  const [step2, setStep2] = useState(false);
  const [finalDetail, setFinalDetail] = useState(null);

  return (
    <>
      <div id="wrapper" className="content--custom">
        {/* Content Wrapper */}
        <div id="content-wrapper" className="d-flex flex-column">
          {/* Main Content */}
          <div id="content" style= {{ height:"100vh" }}>
            {/* <Topbar /> */}

            <div className="container-fluid">
              {/* Page Heading */}
              <h3 className="mb-3 font-weight-bold text-center">
                THÊM LẬP LỊCH
                <button
                  type="button"
                  className="close"
                  onClick={toggleAddSchedule}
                >
                  x
                </button>
              </h3>

              <div className="card shadow mb-4">
                <div className="m-3 row row-cols-7">
                  <span
                    className="col text-center"
                    style={!step1 ? { color: "blue" } : null}
                  >
                    1. CHỌN THÔNG TIN LẬP LỊCH
                  </span>
                  <i className="col text-center fas fa-arrow-right mt-1"></i>
                  <span
                    className="col text-center"
                    style={step1 && !step2 ? { color: "blue" } : null}
                  >
                    2. XÁC NHẬN THÔNG TIN
                  </span>
                </div>
              </div>
              {/* Content Row */}
              {!step1 && (
                <AddScheduleS1
                  setStep1={setStep1}
                  finalDetail={finalDetail}
                  setFinalDetail={setFinalDetail}
                />
              )}
              {step1 && !step2 && (
                <AddScheduleS2
                  setStep1={setStep1}
                  setStep2={setStep2}
                  finalDetail={finalDetail}
                  toggleAddSchedule={toggleAddSchedule}
                  onAction={onAction}
                  setOnAction={setOnAction}
                />
              )}
            </div>
          </div>
          {/* End of Main Content */}
        </div>
        {/* End of Content Wrapper */}
      </div>
    </>
  );
};

export default AddSchedule;
