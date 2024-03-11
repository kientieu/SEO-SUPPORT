import React, { Component } from 'react'

export default class AccountInfoModal extends Component {
  render() {
    return (
      <div>
         {/* The Modal */}
         <div className="modal" id="AccInfo">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h6 className="m-0 font-weight-bold text-primary" >Chi tiết tài khoản</h6>
                            <button type="button" className="close" data-dismiss="modal">×</button>
                        </div>
                        {/* Modal body */}
                        <div className="modal-body">
                            <form>
                                <div className="form-group row">
                                    <label className="col-sm-3 font-weight-bold col-form-label">Tên đăng nhập </label>
                                    <div className="col-sm-9">
                                        <input className="form-control" id="campaign_name" />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-sm-3 font-weight-bold col-form-label">Mật khẩu </label>
                                    <div className="col-sm-9">
                                        <input className="form-control" id="campaign_url" />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-sm-3 font-weight-bold col-form-label"> Website truy cập </label>
                                    <div className="col-sm-9">
                                        <input className="form-control" id="campaign_url" value=" https://old-stdportal.tdtu.edu.vn/Survey/" readOnly />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-sm-3 font-weight-bold col-form-label"> Lần cập nhật cuối </label>
                                    <div className="col-sm-9">
                                        <input className="form-control" id="campaign_url" value=" 12/12/2022 - NghiaNA" readOnly />
                                    </div>
                                </div>

                
                            </form>
                        </div>
                        {/* Modal footer */}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-dismiss="modal">Cập nhật</button>
                            <button type="button" className="btn btn-danger" data-dismiss="modal">Xoá tài khoản</button>
                        </div>
                        
                    </div>
                </div>
            </div>
      </div>
    )
  }
}
