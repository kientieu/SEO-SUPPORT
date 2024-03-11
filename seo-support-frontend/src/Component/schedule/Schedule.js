import { ScheduleURL } from "../../Constants/ScheduleURL";
import useGetFetch from "../../Hook/useGetFetch";
import LoadingIndicator from "../LoadingIndicator";
import ScheduleList from "./ScheduleList";
import AddSchedule from "./AddSchedule";
import { useState } from "react";

const Schedule = () => {
  const [onAction, setOnAction] = useState(false);
  const [addScheduleScreen, setAddScheduleScreen] = useState(false);

  const { data: schedules, isLoading } = useGetFetch(
    ScheduleURL.getAddAutoSch,
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
          {/* <Navbar /> */}

          {/* Content Wrapper */}
          <div id="content-wrapper" className="d-flex flex-column">
            {/* Main Content */}
            <div id="content">
              {/* <Topbar /> */}

              {isLoading && <LoadingIndicator />}

              <div className="container-fluid">
                {/* Content Row */}
                <h3 className="mb-2 font-weight-bold text-center">
                  DANH SÁCH LẬP LỊCH
                </h3>

                <div className="card shadow mb-4">
                  <div className="card-header py-3">
                    <div className="float-right">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={toggleAddSchedule}
                      >
                        Lên lịch đăng
                      </button>
                    </div>
                  </div>

                  <div className="card-body">
                    {schedules && (
                      <ScheduleList
                        schedules={schedules}
                        onAction={onAction}
                        setOnAction={setOnAction}
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
        <AddSchedule
          toggleAddSchedule={toggleAddSchedule}
          onAction={onAction}
          setOnAction={setOnAction}
        />
      )}
    </>
  );
};

export default Schedule;
