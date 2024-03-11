import React from "react";
import { itemsPerPage } from "../../Constants/Pagination";
import Pagination from "react-js-pagination";

const PagePagination = ({
  data,
  activePage,
  setActivePage,
  setOnAction = null,
}) => {
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
    setOnAction(true);
  };
  return (
    <div className="row">
      {data && data.length > 0 && (
        <div className="pagination__container">
          <div className="pagination__quantity col-sm-12 col-md-5">
            <span>
              Showing {activePage} to {Math.ceil(data.length / itemsPerPage)} of{" "}
              {data.length} entries
            </span>
          </div>

          <div className="pagination__wrap col-sm-12 col-md-7">
            <Pagination
              activePage={activePage}
              itemsCountPerPage={itemsPerPage}
              totalItemsCount={data.length}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
              innerClass="pagination__list"
              itemClass="pagination__item"
              linkClass="pagination__link"
              activeLinkClass="pagination__link--active"
              prevPageText="<"
              nextPageText=">"
              hideFirstLastPages
              disabledClass="pagination__item--disabled"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PagePagination;
