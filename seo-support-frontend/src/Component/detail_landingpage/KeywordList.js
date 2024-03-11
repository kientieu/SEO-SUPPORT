import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import DataTable from "../DataTable";
import DeleteKeyword from "./DeleteKeyword";

const KeywordList = ({ detailLPList, onAction, setOnAction }) => {
  const [tableRows, setTableRows] = useState(null);
  const [selectedKW, setSelectedKW] = useState(null);
  const [showDelModal, setShowDelModal] = useState(false);

  const toggleDelModal = useCallback(
    (keyword) => {
      setShowDelModal(!showDelModal);
      setSelectedKW(keyword);
    },
    [showDelModal]
  );

  useEffect(() => {
    const renderTableRows = () => {
      const keywordList = detailLPList.sub_kw;
      var rowsData = [];
      keywordList.map((subKW, index) => {
        var rowItem = {};
        rowItem["id"] = index + 1;
        rowItem["keyword"] = (
          <Link to={`/edit-keyword/${subKW._id}`} searchvalue={subKW.name}>
            {subKW.name}
          </Link>
        );
        rowItem["author"] = subKW.updated_by.name;
        rowItem["action"] = !detailLPList.isLock && (
          <button
            type="button"
            className="btn btn-danger mr-2"
            onClick={() => toggleDelModal(subKW)}
          >
            <i className="fa fa-trash fa-sm text-gray-50" />
          </button>
        );

        return rowsData.push(rowItem);
      });

      setTableRows(rowsData);
    };
    renderTableRows();
  }, [detailLPList, toggleDelModal]);

  const data = {
    columns: [
      {
        label: "ID",
        field: "id",
        sort: "asc",
      },
      {
        label: "TỪ KHOÁ",
        field: "keyword",
      },
      {
        label: "NGƯỜI THÊM",
        field: "author",
      },
      {
        label: "THAO TÁC",
        field: "action",
        sort: "disabled",
      },
    ],
    rows: tableRows,
  };
  return (
    <>
      <DataTable data={data} sortValue={"keyword"} />
      {selectedKW && (
        <DeleteKeyword
          isOpen={showDelModal}
          toggle={toggleDelModal}
          selectedKW={selectedKW}
          onAction={onAction}
          setOnAction={setOnAction}
        />
      )}
    </>
  );
};

export default KeywordList;
