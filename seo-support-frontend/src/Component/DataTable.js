import React from "react";
import { MDBDataTable } from "mdbreact";

const DataTable = ({ data, sortValue }) => {
  return (
    <MDBDataTable
      fixed
      responsive
      bordered
      hover
      noBottomColumns
      paginationLabel={["<", ">"]}
      entriesOptions={[5, 10, 20, 50]}
      sortRows={Array.isArray(sortValue) ? sortValue : [sortValue]}
      data={data}
    />
  );
};

export default DataTable;
