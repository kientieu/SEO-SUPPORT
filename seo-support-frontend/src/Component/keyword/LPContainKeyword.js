import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import DataTable from "../DataTable";
import DeleteModal from "./DeleteModal";

const LPContainKeyword = ({ lpContainKW, onAction, setOnAction }) => {
  const [showDelModal, setShowDelModal] = useState(false);
  const [selectedLP, setSelectedLP] = useState(null);
  const [tableRows, setTableRows] = useState(null);

  const toggleDelModal = useCallback(
    (lp) => {
      setShowDelModal(!showDelModal);
      setSelectedLP(lp);
    },
    [showDelModal]
  );

  useEffect(() => {
    const renderTableRows = () => {
      var rowsData = [];
      lpContainKW.map((lp) => {
        var rowItem = {};
        rowItem["campaign"] = (
          <Link
            to={`/detail-campaign/${lp.campaign._id}`}
            searchvalue={lp.campaign.name}
          >
            {lp.campaign.name}
          </Link>
        );
        rowItem["landingPage"] = (
          <a
            href={`${lp.url}`}
            target="_blank"
            rel="noreferrer"
            searchvalue={lp.url}
          >
            {lp.url}
          </a>
        );
        rowItem["action"] = (
          <button
            type="button"
            className="btn btn-danger mr-2"
            onClick={() => toggleDelModal(lp)}
          >
            <i className="fa fa-trash fa-sm text-gray-50" />
          </button>
        );
        return rowsData.push(rowItem);
      });

      setTableRows(rowsData);
    };
    renderTableRows();
  }, [lpContainKW, toggleDelModal]);

  const data = {
    columns: [
      {
        label: "Chiến dịch",
        field: "campaign",
        sort: "asc",
      },
      {
        label: "Landing page",
        field: "landingPage",
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
    <div className="card-body">
      <DataTable data={data} sortValue={["campaign", "landingPage"]} />
      {selectedLP && (
        <DeleteModal
          selectedLP={selectedLP}
          isOpen={showDelModal}
          toggle={toggleDelModal}
          onAction={onAction}
          setOnAction={setOnAction}
        />
      )}
    </div>
  );
};

export default LPContainKeyword;
