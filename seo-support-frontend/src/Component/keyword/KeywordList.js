import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import DeleteModal from "./DeleteModal";
import DataTable from "../DataTable";

const KeywordList = ({ keywords, onAction, setOnAction }) => {
  const [showDelModal, setShowDelModal] = useState(false);
  const [item, setItem] = useState(null);
  const [tableRows, setTableRows] = useState(null);

  const toggleDelModal = useCallback(
    (keyword) => {
      setShowDelModal(!showDelModal);
      setItem(keyword);
    },
    [showDelModal]
  );

  useEffect(() => {
    const renderTableRows = () => {
      var rowsData = [];
      keywords.map((keyword, index) => {
        var rowItem = {};
        rowItem["id"] = index + 1;
        rowItem["keyword"] = (
          <Link searchvalue={keyword.name} to={`/edit-keyword/${keyword._id}`}>
            {keyword.name}
          </Link>
        );
        // rowItem["action"] = (
        //   <button
        //     type="button"
        //     className="btn btn-danger mr-2"
        //     onClick={() => toggleDelModal(keyword)}
        //   >
        //     <i className="fa fa-trash fa-sm text-gray-50" />
        //   </button>
        // );
        rowItem["updated_by"] = keyword.updated_by.name;
        rowItem["created_at"] = new Date(keyword.created_at).toLocaleString("en-GB");
        return rowsData.push(rowItem);
      });

      setTableRows(rowsData);
    };
    renderTableRows();
  }, [keywords, toggleDelModal]);

  const data = {
    columns: [
      {
        label: "ID",
        field: "id",
        sort: "asc",
      },
      {
        label: "Từ khoá",
        field: "keyword",
      },
      // {
      //   label: "Thao tác",
      //   field: "action",
      //   sort: "disabled"
      // },
      {
        label: "Người tạo",
        field: "updated_by",
      },
      {
        label: "Ngày tạo",
        field: "created_at",
      },
    ],
    rows: tableRows,
  };

  return (
    <>
      <DataTable data={data} sortValue={"keyword"} />

      {item && (
        <DeleteModal
          isOpen={showDelModal}
          toggle={toggleDelModal}
          item={item}
          onAction={onAction}
          setOnAction={setOnAction}
        />
      )}
    </>
  );
};

export default KeywordList;
