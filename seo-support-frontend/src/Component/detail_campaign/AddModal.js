import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { LPURL } from "../../Constants/LPURL";
import usePostFetch from "../../Hook/usePostFetch";
import LatinizeString from "../../Services/LatinizeString";

const AddModal = ({ isOpen, toggle, onAction, setOnAction, campaign }) => {
    var { campaign_id } = useParams();

    const [keyword, setKeyword] = useState("");
    const [lpURL, setLPURL] = useState("");
    const [isPending, setIsPending] = useState(false);
    
    useEffect(() => {
        setLPURL(campaign.url);
    }, [campaign])

    var newLP = {
        campaignID: campaign._id,
        kwName: keyword,
        lpURL
    }

    const suggestLPURL = (e) => {
        var kwValue = e.target.value;
        setKeyword(kwValue);
        if (!LatinizeString.isLatin(kwValue)) {
            kwValue = LatinizeString.latinize(kwValue);
        }
        kwValue = kwValue.toLowerCase().replace(/\s/g, '-');
        var suggestURL = `${campaign.url}/${kwValue}`;
        setLPURL(suggestURL);
    }

    const AddLandingPage = async (e) => {
        e.preventDefault();
        const result = await usePostFetch(LPURL.getAdd(campaign_id), "POST", null, newLP, onAction, setOnAction, setIsPending, toggle);
        if (result) {
            setKeyword("");
            setLPURL("");
        }
    }

    return (
        <Modal show={isOpen} size="lg" centered>
            <form onSubmit={(e) => AddLandingPage(e)}>
                <Modal.Header>
                    <h6 className="m-0 font-weight-bold text-primary" >Thêm Landing page</h6>
                    <button type="button" className="close" onClick={toggle}>×</button>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group row">
                        <label className="col-sm-3 font-weight-bold col-form-label">Từ khoá <span className="text-danger"  >*</span></label>
                        <div className="col-sm-9">
                            <input className="form-control" id="keyword" value={keyword} required onChange={(e) => {
                                suggestLPURL(e);
                            }
                            } />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-3 font-weight-bold col-form-label">Đường dẫn</label>
                        <div className="col-sm-9">
                            <input className="form-control" id="landingpage_url"
                                value={lpURL} required onChange={(e) => setLPURL(e.target.value)} />
                            <p className="text-primary">(Đường dẫn sẽ sinh tự động nếu người dùng không điền vào)</p>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggle}>
                        Đóng
                    </Button>
                    {isPending ? (
                        <Button type="submit" variant="primary" disabled>
                            Đang Lưu...
                        </Button>
                    ) : (
                        <Button type="submit" variant="primary">
                            Lưu
                        </Button>
                    )}
                </Modal.Footer>
            </form>
        </Modal>
    )
}

export default AddModal