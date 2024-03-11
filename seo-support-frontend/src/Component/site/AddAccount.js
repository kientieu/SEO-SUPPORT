import React, { Component } from 'react'

export default class AddAccount extends Component {
  render() {
    return (
      <div>
          <button type="button" class="btn btn-success ">
            <i className="fas fa-user-plus fa-sm text-gray-50" data-toggle="modal" data-target="#AddAcc" />
          </button>

           {/* The Modal */}
         <div className="modal" id="AddAcc">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h6 className="m-0 font-weight-bold text-primary" >Thêm tài khoản mới</h6>
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
                                        <input className="form-control" type="password" id="campaign_url" />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <label className="col-sm-3 font-weight-bold col-form-label"> Website truy cập </label>
                                    <div className="col-sm-9">
                                        <input className="form-control" id="campaign_url" value=" https://old-stdportal.tdtu.edu.vn/Survey/" readOnly />
                                    </div>
                                </div>

                                <div className='text-danger font-weight-bold'>Hoặc<br></br><br></br></div>

                                <div className="form-group row">
                                    <label className="col-sm-3 font-weight-bold col-form-label"> Thêm bằng tệp </label>
                                    <div class="col-sm-9 file-upload-wrapper">
                                        <input type="file" id="input-file-now" class="file-upload" />
                                    </div>
                                </div>


                                <div className="form-group row">
                                    <label className="ml-2 col-sm-3 font-weight-bold col-form-label"></label>
                                    <button type="button" class="btn btn-info ">Tải file mẫu</button>
                                </div>



                            </form>
                        </div>
                        {/* Modal footer */}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-dismiss="modal">Lưu</button>
                            <button type="button" className="btn btn-danger"data-dismiss="modal" >Huỷ</button>
                        </div>
                        
                    </div>
                </div>
            </div>
      </div>
      
    )
  }
}
