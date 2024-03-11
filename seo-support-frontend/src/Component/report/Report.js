import React from "react";
import PieChart from "./Charts/PieChart";
import KeywordsSortByDateChart from "./Charts/KeywordsSortByDateChart";
import { KeywordURL } from "../../Constants/KeywordURL";
import { ScheduleURL } from "../../Constants/ScheduleURL";
import useGetFetch from "../../Hook/useGetFetch";
import LoadingIndicator from "../LoadingIndicator";
import { TopTenChart } from "./Charts/TopTenChart";

const Report = () => {
  const { data: keywordsSortByDate, isLoading } = useGetFetch(
    KeywordURL.getSortByDate("created_at", "asc")
  );

  const { data: schedules, isLoading: isLoading1 } = useGetFetch(
    ScheduleURL.getAll
  );

  const { data: keywordsTopTen, isLoading: isLoading2 } = useGetFetch(
    KeywordURL.getTopTen
  );

  return (
    <div id="wrapper" className="content--custom">
      {/* Sidebar */}
      {/* <Navbar /> */}

      {/* Content Wrapper */}
      <div id="content-wrapper" className="d-flex flex-column">
        {/* Main Content */}
        <div id="content">
          {/* <Topbar /> */}

          {isLoading && isLoading1 && isLoading2 && <LoadingIndicator />}

          <div className="container-fluid">
            {/* <!-- Page Heading --> */}
            <h3 className="mb-2 font-weight-bold text-center">THỐNG KÊ</h3>

            {/* <!-- Content Row --> */}
            <div className="row">
              <div className="col-xl-8 col-lg-7">
                {/* <!-- Area Chart --> */}
                <div className="card shadow mb-4">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">
                      Biểu đồ số lượng các từ khoá được tạo
                    </h6>
                  </div>
                  <div className="card-body">
                    {keywordsSortByDate && (
                      <KeywordsSortByDateChart fetchData={keywordsSortByDate} />
                    )}
                  </div>
                </div>
              </div>

              {/* <!-- Donut Chart --> */}
              <div className="col-xl-4 col-lg-5">
                <div className="card shadow mb-4">
                  {/* <!-- Card Header - Dropdown --> */}
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">
                      Biểu đồ trạng thái đăng bài
                    </h6>
                  </div>
                  {/* <!-- Card Body --> */}
                  <div className="card-body">
                    <div className="chart" style={{ maxHeight: "400px" }}>
                      {schedules && <PieChart fetchData={schedules} />}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top ten chart */}
            <div className="row" style={{ marginTop: "2rem" }}>
              <div className="col-xl-12 col-lg-12">
                <div className="card shadow mb-4">
                  {/* <!-- Card Header - Dropdown --> */}
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">
                      Biểu đồ top 10 từ khoá có số lượng sử dụng trong bài viết nhiều nhất
                    </h6>
                  </div>
                  {/* <!-- Card Body --> */}
                  <div className="card-body">
                    <div className="chart" style={{ maxHeight: "800px" }}>
                      {keywordsTopTen && (
                        <TopTenChart fetchData={keywordsTopTen} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End of Main Content */}
      </div>
      {/* End of Content Wrapper */}
    </div>
  );
};

export default Report;
