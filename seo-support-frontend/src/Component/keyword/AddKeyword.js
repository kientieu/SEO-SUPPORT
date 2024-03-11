import { useState, useEffect } from "react";
import { LPURL } from "../../Constants/LPURL";
import { KeywordURL } from "../../Constants/KeywordURL";
import { Modal, Button } from "react-bootstrap";
import Select from "react-select";
import usePostFetch from "../../Hook/usePostFetch";

const AddKeyword = ({
  isOpen,
  toggle,
  keyword_id,
  kwDetails,
  campaignOpts,
  onAction,
  setOnAction
}) => {
  const [keywordName, setKeywordName] = useState("");
  const [inputKWName, setInputKWName] = useState(false);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [lPOptions, setLPOptions] = useState([]);
  const [selectedLP, setSelectedLP] = useState([]);
  const [isOptLoading, setIsOptLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (kwDetails) {
      setInputKWName(true);
      setKeywordName(kwDetails.name);
    }
  }, [kwDetails]);

  const handleCampaignSelect = (option, { action }) => {
    switch (action) {
      case "input-change":
        if (option) {
          setSelectedCampaigns(option);
        }
        return;
      case "menu-close":
        return;
      case "clear":
        setSelectedCampaigns([]);
        setSelectedLP([]);
        return;
      case "select-option":
        if (option) {
          setSelectedCampaigns(option);
        }
        return;
      case "remove-value":
        if (option) {
          setSelectedCampaigns(option);
        }
        return;
      default:
        return;
    }
  };

  useEffect(() => {
    if (!selectedCampaigns.length) {
      setLPOptions([]);
    }
  }, [selectedCampaigns]);

  const handleLpSelect = (option, { action }, index) => {
    switch (action) {
      case "input-change":
        if (option) {
          if (selectedLP.length) {
            let selectedLPs = [...selectedLP, option];
            setSelectedLP(selectedLPs);
          } else {
            setSelectedLP([option]);
          }
        }
        return;
      case "menu-close":
        return;
      case "clear":
        var selectedCampaignsTmp = selectedCampaigns.filter((item, i) => i !== index);
        setSelectedCampaigns(selectedCampaignsTmp);

        let selectedLPs = selectedLP.filter((item, i) => i !== index);
        setSelectedLP(selectedLPs);
        return;
      case "select-option":
        if (option) {
          if (selectedLP.length) {
            let selectedLPs = [...selectedLP, option];
            setSelectedLP(selectedLPs);
          } else {
            setSelectedLP([option]);
          }
        }
        return;
      default:
        return;
    }
  };

  function getLPAsync(selectedCampaign) {
    setIsOptLoading(true);
    var token = localStorage.getItem("token");
    var myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    var queryString = kwDetails ? `?keyword=${kwDetails._id}&campaigns=` : `?campaigns=`;
    selectedCampaigns.forEach((campaign, i) => {
      queryString += campaign.value;
      if (i < selectedCampaigns.length - 1) {
        queryString += ";";
      }
    });

    fetch(LPURL.getSearch(queryString), requestOptions)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data && data.code === 200) {
          const landingPages = data.data;
          const toSelectOption = ({ _id, url }) => ({ label: url, value: _id });

          const filterLPs = landingPages.filter(lp => lp.campaign === selectedCampaign.value && !lp.isLock);
          setLPOptions(filterLPs.map(toSelectOption));
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsOptLoading(false));
  }

  const AddNewKW = async (e) => {
    e.preventDefault();
    const newKWObj = {
      keywordName,
      selectedLP,
    };
    const result = await usePostFetch(
      KeywordURL.getAdd,
      "POST",
      null,
      newKWObj,
      onAction,
      setOnAction,
      setIsPending,
      toggle
    );
    if (result) {
      setKeywordName("");
      setSelectedCampaigns([]);
      setSelectedLP([]);
    }
  };
  
  const UpdateKWDetails = async (e) => {
    e.preventDefault();
    const kwDetailsObj = {
      selectedLP,
    };
    const result = await usePostFetch(
      KeywordURL.getEditDetails(keyword_id),
      "PUT",
      null,
      kwDetailsObj,
      onAction,
      setOnAction,
      setIsPending,
      toggle
    );
    if (result) {
      setSelectedCampaigns([]);
      setSelectedLP([]);
    }
  };

  return (
    <Modal show={isOpen} size="lg" centered>
      <form onSubmit={(e) => {
        if (!inputKWName) {
          AddNewKW(e);
        } else {
          UpdateKWDetails(e);
        }
      }}>
        <Modal.Header>
          <h6 className="m-0 font-weight-bold text-primary">
            Thêm Landing page cho từ khoá
          </h6>
          <button type="button" className="close" onClick={toggle}>
            ×
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group row">
            <label className="col-sm-3 font-weight-bold col-form-label">
              Từ khoá <span className="text-danger">*</span>
            </label>
            <div className="col-sm-9">
              <input
                className="form-control"
                id="keyword_name"
                readOnly={inputKWName}
                value={keywordName}
                onChange={(e) => setKeywordName(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 font-weight-bold col-form-label">
              Chọn chiến dịch
            </label>
            <div className="col-sm-9">
              <Select
                isMulti
                closeMenuOnSelect={false}
                name="colors"
                options={campaignOpts}
                className="basic-multi-select"
                classNamePrefix="select"
                value={selectedCampaigns}
                onChange={handleCampaignSelect}
              />
            </div>
          </div>
          {selectedCampaigns.map((selectedCampaign, index) => {
            return (
              <div className="form-group row" key={selectedCampaign.value}>
                <label className="col-sm-3 font-weight-bold col-form-label">
                  Chọn Landing page cho "<i>{selectedCampaign.label}</i>"
                </label>
                <div className="col-sm-9">
                  <Select
                    name="colors"
                    options={lPOptions}
                    onFocus={() => getLPAsync(selectedCampaign)}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    isClearable
                    isLoading={isOptLoading}
                    value={selectedLP[index]}
                    onChange={(option, event) => handleLpSelect(option, event, index)}
                  />
                </div>
              </div>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggle} disabled={isPending}>
            Đóng
          </Button>
          {isPending ? (
            <Button type="submit" variant="primary" disabled>
              Đang lưu...
            </Button>
          ) : (
            <Button type="submit" variant="primary">
              Thêm
            </Button>
          )}
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default AddKeyword;
