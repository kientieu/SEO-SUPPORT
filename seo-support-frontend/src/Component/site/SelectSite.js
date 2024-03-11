import { useState } from "react";
import { Link, useParams } from "react-router-dom";
// import Navbar from "../Navbar";
// import Topbar from "../Topbar";
import SelectSiteS1 from "./SelectSiteS1";
import SelectSiteS2 from "./SelectSiteS2";
import SelectSiteS3 from "./SelectSiteS3";
import SelectSiteS4 from "./SelectSiteS4";

const SelectSite = () => {
  const { post_id } = useParams();
  const [finalDetail, setFinalDetail] = useState({});
  const [result, setResult] = useState(null);
  const [step1, setStep1] = useState(false);
  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);

  return (
    <div id="wrapper" className="content--custom">
      {/* Sidebar */}
      {/* <Navbar /> */}

      {/* Content Wrapper */}
      <div id="content-wrapper" className="d-flex flex-column">
        {/* Main Content */}
        <div id="content">
          {/* <Topbar /> */}

          <div className="container-fluid">
            {/* Page Heading */}
            <h3 className="mb-2 font-weight-bold text-center">
              ĐĂNG BÀI VIẾT
              <button type="button" className="close">
                <Link
                  to={`/edit-post/${post_id}`}
                  style={{ textDecoration: "none" }}
                >
                  x
                </Link>
              </button>
            </h3>

            <div className="card shadow mb-4">
              <div className="m-3 row row-cols-7">
                <span
                  className="col text-center"
                  style={!step1 ? { color: "blue" } : null}
                >
                  1. CHỌN SITE VỆ TINH
                </span>
                <i className="col text-center fas fa-arrow-right mt-1"></i>
                <span
                  className="col text-center"
                  style={step1 && !step2 ? { color: "blue" } : null}
                >
                  2. CHỌN THÔNG TIN SITE VỆ TINH
                </span>
                <i className="col text-center fas fa-arrow-right mt-1"></i>
                <span
                  className="col text-center"
                  style={step1 && step2 && !step3 ? { color: "blue" } : null}
                >
                  3. XÁC NHẬN
                </span>
                <i className="col text-center fas fa-arrow-right mt-1"></i>
                <span
                  className="col text-center"
                  style={step1 && step2 && step3 ? { color: "blue" } : null}
                >
                  4. KẾT QUẢ
                </span>
              </div>
            </div>

            {!step1 && (
              <SelectSiteS1
                setStep1={setStep1}
                finalDetail={finalDetail}
                setFinalDetail={setFinalDetail}
              />
            )}
            {step1 && !step2 && (
              <SelectSiteS2
                setStep1={setStep1}
                setStep2={setStep2}
                finalDetail={finalDetail}
                setFinalDetail={setFinalDetail}
              />
            )}
            {step1 && step2 && !step3 && (
              <SelectSiteS3
                setStep1={setStep1}
                setStep2={setStep2}
                setStep3={setStep3}
                finalDetail={finalDetail}
                setFinalDetail={setFinalDetail}
                setResult={setResult}
              />
            )}
            {step1 && step2 && step3 && <SelectSiteS4 result={result} />}
          </div>
        </div>
        {/* End of Main Content */}
      </div>
      {/* End of Content Wrapper */}
    </div>
  );
};

export default SelectSite;
