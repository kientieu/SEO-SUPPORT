import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import DataTable from "../DataTable";
import CancelSchModal from "./CancelSchModal";

const ScheduleList = ({ schedules, onAction, setOnAction }) => {
  const [tableRows, setTableRows] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [schInfo, setSchInfo] = useState(null);

  const toggleCancelModal = useCallback(
    (schedule) => {
      setShowCancelModal(!showCancelModal);
      setSchInfo(schedule);
    },
    [showCancelModal]
  );

  useEffect(() => {
    const renderTableRows = () => {
      var rowsData = [];
      schedules.map((schedule) => {
        var rowItem = {};
        rowItem["id"] = (
          <Link
            to={`/schedule-detail/${schedule._id}`}
            searchvalue={schedule._id}
          >
            {schedule._id}
          </Link>
        );
        rowItem["postTitle"] = (
          <>
            <a
              href={`/edit-post/${schedule.post_info._id}`}
              target="_blank"
              rel="noreferrer"
            >
              {schedule.post_info.title}
            </a>
          </>
        );
        rowItem["scheduleDate"] = new Date(schedule.date).toLocaleString(
          "en-GB"
        );
        rowItem["status"] = schedule.status;
        rowItem["action"] = (
          <>
            {schedule.status.toLowerCase() ===
              "Đang thực hiện".toLowerCase() && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => toggleCancelModal(schedule)}
              >
                Huỷ đăng
              </button>
            )}
          </>
        );

        return rowsData.push(rowItem);
      });

      setTableRows(rowsData);
    };
    renderTableRows();
  }, [schedules, toggleCancelModal]);

  const data = {
    columns: [
      {
        label: "Mã yêu cầu",
        field: "id",
      },
      {
        label: "TIÊU ĐỀ",
        field: "postTitle",
        sort: "disabled",
      },
      {
        label: "NGÀY HẸN",
        field: "scheduleDate",
        sort: "asc",
      },
      {
        label: "TÌNH TRẠNG",
        field: "status",
      },
      {
        label: "Thao tác",
        field: "action",
        sort: "disabled",
      },
    ],
    rows: tableRows,
  };

  return (
    <>
      <DataTable data={data} sortValue={"id"} />

      {schInfo && (
        <CancelSchModal
          isOpen={showCancelModal}
          toggle={toggleCancelModal}
          schInfo={schInfo}
          onAction={onAction}
          setOnAction={setOnAction}
        />
      )}
    </>
  );
};

export default ScheduleList;
