
const DeleteModal = () => {
  return (
      <>
          {/* The Modal import file*/}
          <div className="modal" id="delete">
              <div className="modal-dialog" role="document">
                  <div className="modal-content">
                      <div className="modal-header">
                          <h5 className="m-0 font-weight-bold text-primary" id="exampleModalLabel">Thông báo xác nhận</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">×</span>
                          </button>
                      </div>
                      <div className="modal-body">
                          Bạn có chắc chắn xoá <b>ABC</b> ?
                      </div>
                      <div className="modal-footer">
                          <button type="button" className="btn btn-danger">Xoá</button>
                          <button type="button" className="btn btn-primary" data-dismiss="modal">Huỷ</button>
                      </div>
                  </div>
              </div>
          </div>
      </>
  )
}

export default DeleteModal