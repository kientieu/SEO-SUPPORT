import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DataTable from "../DataTable";

const SiteList = ({ satSites, postsOfSite }) => {
  const [tableRows, setTableRows] = useState(null);

  useEffect(() => {
    const renderTableRows = () => {
      var rowsData = [];
      satSites.map((site, index) => {
        var rowItem = {};
        rowItem["order"] = index + 1;
        rowItem["name"] = (
          <Link to={`/site-detail/${site._id}`} searchvalue={site.name}>
            {site.name}
          </Link>
        );
        rowItem["url"] = (
          <a
            target="_blank"
            rel="noreferrer"
            href={site.url}
            searchvalue={site.url}
          >
            {site.url}
          </a>
        );
        rowItem["level"] = site.level;
        return rowsData.push(rowItem);
      });

      setTableRows(rowsData);
    };
    renderTableRows();
  }, [satSites, postsOfSite]);

  const data = {
    columns: [
      {
        label: "STT",
        field: "order",
      },
      {
        label: "TÊN",
        field: "name",
      },
      {
        label: "ĐƯỜNG DẪN",
        field: "url",
      },
      {
        label: "LEVEL",
        field: "level",
        sort: "asc",
      },
    ],
    rows: tableRows,
  };

  return (
    <>
      <DataTable data={data} sortValue={["name", "url"]} />
    </>
  );
};

export default SiteList;
