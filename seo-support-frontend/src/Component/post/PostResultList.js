import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import DataTable from "../DataTable";

const PostResultList = ({ results }) => {
  const location = useLocation();
  const [tableRows, setTableRows] = useState(null);

  useEffect(() => {
    const renderTableRows = () => {
      var rowsData = [];
      results.map((result, index) => {
        var rowItem = {};
        rowItem["id"] = (
          <Link to={`/post/results/${result._id}`} searchvalue={result._id}>
            {result._id}
          </Link>
        );
        rowItem["title"] = (
          <a
            href={`/edit-post/${result.post_info._id}`}
            target="_blank"
            rel="noreferrer"
            searchvalue={result.post_info.title}
          >
            {result.post_info.title}
          </a>
        );
        rowItem["satSite"] = result.sat_site.name;
        rowItem["level"] = result.sat_site.level;
        rowItem["date"] = new Date(result.date).toLocaleString("en-GB");
        rowItem["status"] = result.status;
        return rowsData.push(rowItem);
      });

      setTableRows(rowsData);
    };
    renderTableRows();
  }, [results, location]);

  const data = {
    columns: [
      {
        label: "Mã kết quả",
        field: "id",
      },
      {
        label: "Tiêu đề bài viết",
        field: "title",
      },
      {
        label: "Loại site vệ tinh",
        field: "satSite",
      },
      {
        label: "Level",
        field: "level",
      },
      {
        label: "Ngày đăng",
        field: "date",
        sort: "asc",
      },
      {
        label: "Tình trạng",
        field: "status",
      },
    ],

    rows: tableRows,
  };

  return (
    <>
      <DataTable data={data} sortValue={["id", "title"]} />
    </>
  );
};

export default PostResultList;
