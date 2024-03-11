import { useState } from "react";

const ListAccount = () => {
  return (
    <div>
      <div className="dropdown dropleft">
        <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">
          <i className="fas fa-user-friends fa-sm text-white-50" />
        </button>
        <div className="dropdown-menu pre-scrollable">
          <div className="text-center text-danger dropdown-header" href="#">DANH SÁCH TÀI KHOẢN</div>
          <div className="dropdown-divider" />
          <a className=" dropdown-item" data-toggle="modal" data-target="#AccInfo">NghiaNA@gmail.com</a>
          <a className="dropdown-item" data-toggle="modal" data-target="#AccInfo">Kien@gmail.com</a>
          <a className="dropdown-item" data-toggle="modal" data-target="#AccInfo">NghiaNA@gmail.com</a>
          <a className="dropdown-item" data-toggle="modal" data-target="#AccInfo">Kien@gmail.com</a>
          <a className="dropdown-item" data-toggle="modal" data-target="#AccInfo">NghiaNA@gmail.com</a>
          <a className="dropdown-item" data-toggle="modal" data-target="#AccInfo">Kien@gmail.com</a>
          <a className="dropdown-item" data-toggle="modal" data-target="#AccInfo">NghiaNA@gmail.com</a>
          <a className="dropdown-item" data-toggle="modal" data-target="#AccInfo">Kien@gmail.com</a>
          <a className="dropdown-item" data-toggle="modal" data-target="#AccInfo">NghiaNA@gmail.com</a>
          <a className="dropdown-item" data-toggle="modal" data-target="#AccInfo">Kien@gmail.com</a>
          <a className="dropdown-item" data-toggle="modal" data-target="#AccInfo">NghiaNA@gmail.com</a>
          <a className="dropdown-item" data-toggle="modal" data-target="#AccInfo">Kien@gmail.com</a>
          <a className="dropdown-item" data-toggle="modal" data-target="#AccInfo">NghiaNA@gmail.com</a>
          <a className="dropdown-item" data-toggle="modal" data-target="#AccInfo">Kien@gmail.com</a>
        </div>
      </div>
    </div>
  );
};

export default ListAccount;
