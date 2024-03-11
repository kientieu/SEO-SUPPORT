import { useState, useEffect } from "react";
import { CampaignURL } from "../../Constants/CampaignURL";
// import Navbar from "../Navbar";
// import Topbar from "../Topbar";
import CampaignList from "./CampaignList";
import useGetFetch from "../../Hook/useGetFetch";
import LoadingIndicator from "../LoadingIndicator";
import { itemsPerPage } from "../../Constants/Pagination";
import PagePagination from "../pagination/PagePagination";
const ClosedCampaign = () => {
  const [onAction, setOnAction] = useState(false);
  const [activePage, setActivePage] = useState(1);

  const [activeData, setActiveData] = useState([]);

  const { data: closedCampaigns, isLoading } = useGetFetch(
    CampaignURL.getClosed,
    null,
    onAction
  );

  useEffect(() => {
    if (closedCampaigns) {
      const data = closedCampaigns.slice(
        (activePage - 1) * itemsPerPage,
        activePage * itemsPerPage
      );
      setActiveData(data);
    }
  }, [closedCampaigns, activePage]);

  return (
    <div id="wrapper" className="content--custom">
      {/* Sidebar */}
      {/* <Navbar /> */}

      {/* Content Wrapper */}
      <div id="content-wrapper" className="d-flex flex-column">
        {/* Main Content */}
        <div id="content">
          {/* <Topbar /> */}

          {isLoading && <LoadingIndicator />}

          <div className="container-fluid">
            {/* Page Heading */}
            <div className="d-sm-flex align-items-center justify-content-between mb-4">
              <h3 className="font-weight-bold">CHIẾN DỊCH ĐÃ ĐÓNG</h3>
            </div>
            {/* Content Row */}
            <div className="row">
              {/* Chiến dịch */}
              {activeData && (
                <CampaignList
                  campaigns={activeData}
                  onAction={onAction}
                  setOnAction={setOnAction}
                />
              )}
            </div>

            {/* Pagination Row */}
            {closedCampaigns && (
              <PagePagination
                data={closedCampaigns}
                activePage={activePage}
                setActivePage={setActivePage}
                setOnAction={setOnAction}
              />
            )}
          </div>
        </div>
        {/* End of Main Content */}
      </div>
      {/* End of Content Wrapper */}
    </div>
  );
};

export default ClosedCampaign;
