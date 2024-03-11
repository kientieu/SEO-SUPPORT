import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import LockLPModal from "./LockLPModal";
import EditModal from "./EditModal";
import UnlockLPModal from "./UnlockLPModal";
import DataTable from "../DataTable";

const LandingPageList = ({ landingPages, campaign, onAction, setOnAction }) => {
  const [showLockModal, setShowLockModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [item, setItem] = useState(null);
  const [tableRows, setTableRows] = useState(null);

  const toggleLockModal = useCallback(
    (landingPage) => {
      setShowLockModal(!showLockModal);
      setItem(landingPage);
    },
    [showLockModal]
  );

  const toggleUnlockModal = useCallback(
    (landingPage) => {
      setShowUnlockModal(!showUnlockModal);
      setItem(landingPage);
    },
    [showUnlockModal]
  );

  const toggleEditModal = useCallback(
    (landingPage) => {
      setShowEditModal(!showEditModal);
      setItem(landingPage);
    },
    [showEditModal]
  );

  useEffect(() => {
    const renderTableRows = () => {
      var rowsData = [];
      landingPages.map((landingPage, index) => {
        var rowItem = {};
        rowItem["index"] = index + 1;
        rowItem["mainKeyword"] = (
          <Link
            to={`/detail-lp/${landingPage._id}`}
            searchvalue={landingPage.main_kw.name}
          >
            {landingPage.main_kw.name}
          </Link>
        );
        rowItem["url"] = (
          <a
            target="_blank"
            rel="noreferrer"
            href={landingPage.url}
            searchvalue={landingPage.url}
          >
            {landingPage.url}
          </a>
        );
        rowItem["action"] = (
          <div className="text-center">
            <button
              type="button"
              className="btn btn-primary m-1"
              onClick={(e) => toggleEditModal(landingPage)}
            >
              <i className="fas fa-edit fa-sm text-gray-50" />
            </button>

            {landingPage.isLock ? (
              <button
                type="button"
                className="btn btn-dark m-1"
                onClick={() => toggleUnlockModal(landingPage)}
              >
                <i className="fa fa-lock fa-sm text-gray-50" />
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-success m-1"
                onClick={() => toggleLockModal(landingPage)}
              >
                <i className="fa fa-unlock fa-sm text-gray-50" />
              </button>
            )}
          </div>
        );

        return rowsData.push(rowItem);
      });

      setTableRows(rowsData);
    };
    renderTableRows();

    if (landingPages) {
      checkIsLock(landingPages);
    }
  }, [landingPages, toggleEditModal, toggleLockModal, toggleUnlockModal]);

  const data = {
    columns: [
      {
        label: "STT",
        field: "index",
        sort: "asc",
      },
      {
        label: "TÊN",
        field: "mainKeyword",
      },
      {
        label: "ĐƯỜNG DẪN",
        field: "url",
      },
      {
        label: "THAO TÁC",
        field: "action",
        sort: "disabled",
      },
    ],
    rows: tableRows,
  };

  const checkIsLock = (landingPages) => {
    setTimeout(() => {
      const tableCard = document.getElementById("landing-page-list");
      var rows = tableCard.querySelectorAll("tr");
      rows = Array.from(rows).slice(1);

      rows.forEach((row, index) => {
        if (landingPages[index].isLock) {
          row.style.backgroundColor = "LightGrey";
        } else {
          row.style.backgroundColor = "White";
        }
      });
    }, 4);
  };

  return (
    <>
      <DataTable data={data} sortValue={["mainKeyword", "url"]} />
      {item && (
        <EditModal
          isOpen={showEditModal}
          toggle={toggleEditModal}
          item={item}
          campaign={campaign}
          onAction={onAction}
          setOnAction={setOnAction}
        />
      )}
      {item && (
        <LockLPModal
          isOpen={showLockModal}
          toggle={toggleLockModal}
          item={item}
          onAction={onAction}
          setOnAction={setOnAction}
        />
      )}
      {item && (
        <UnlockLPModal
          isOpen={showUnlockModal}
          toggle={toggleUnlockModal}
          item={item}
          onAction={onAction}
          setOnAction={setOnAction}
        />
      )}
    </>
  );
};

export default LandingPageList;
