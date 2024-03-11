import { useState } from "react";
import { Link } from "react-router-dom";
import EditModal from "./EditModal";
import LockCfmModal from "./LockCfmModal";
import UnlockCfmModal from "./UnlockCfmModal";

const CampaignList = ({ campaigns, onAction, setOnAction }) => {
  const cardColors = ["success", "secondary"];

  const [showEditModal, setShowEditModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [item, setItem] = useState(null);

  const toggleEditModal = (campaign) => {
    setShowEditModal(!showEditModal);
    setItem(campaign);
  };

  const toggleLockModal = (campaign) => {
    setShowLockModal(!showLockModal);
    setItem(campaign);
  };

  const toggleUnlockModal = (campaign) => {
    setShowUnlockModal(!showUnlockModal);
    setItem(campaign);
  };

  return (
    <>
      {campaigns.map((campaign) => {
        var index = 0;
        if (campaign.isLock) {
          index = 1;
        }
        return (
          <div className="col-xl-3 col-md-6 mb-4" key={campaign._id}>
            <div
              className={`card border-left-${cardColors[index]} shadow h-100 py-2`}
            >
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <Link
                  to={`/detail-campaign/${campaign._id}`}
                  className="text-s font-weight-bold text-primary text-uppercase mb-1 text-center"
                >
                  {campaign.name}
                </Link>
                <div className="dropdown no-arrow">
                  <span
                    className="dropdown-toggle"
                    role="button"
                    id="dropdownMenuLink"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400" />
                  </span>
                  <div
                    className="dropdown-menu dropdown-menu-right shadow animated-fade-in"
                    aria-labelledby="dropdownMenuLink"
                  >
                    {campaign.isLock ? (
                      <button
                        className="dropdown-item text-center"
                        onClick={() => toggleUnlockModal(campaign)}
                      >
                        <i className="fas fa-unlock fa-sm fa-fw mr-2"></i>
                        Mở
                      </button>
                    ) : (
                      <>
                        <button
                          className="dropdown-item text-center"
                          onClick={() => toggleEditModal(campaign)}
                        >
                          <i className="fas fa-edit fa-sm fa-fw mr-2"></i>
                          Sửa
                        </button>
                        <button
                          className="dropdown-item text-center"
                          onClick={() => toggleLockModal(campaign)}
                        >
                          <i className="fas fa-lock fa-sm fa-fw mr-2"></i>
                          Đóng
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="card-body">
                <span className="text-xs float-left mb-1">
                  {campaign.author.name}
                </span>
                <span className="text-xs float-right mb-1">
                  {new Date(campaign.created_at).toLocaleDateString("en-GB")}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      {item && (
        <EditModal
          isOpen={showEditModal}
          toggle={toggleEditModal}
          campaign={item}
          onAction={onAction}
          setOnAction={setOnAction}
        />
      )}
      {item && (
        <LockCfmModal
          isOpen={showLockModal}
          toggle={toggleLockModal}
          campaign={item}
          onAction={onAction}
          setOnAction={setOnAction}
        />
      )}
      {item && (
        <UnlockCfmModal
          isOpen={showUnlockModal}
          toggle={toggleUnlockModal}
          campaign={item}
          onAction={onAction}
          setOnAction={setOnAction}
        />
      )}
    </>
  );
};

export default CampaignList;
