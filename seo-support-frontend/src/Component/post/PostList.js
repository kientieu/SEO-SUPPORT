import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import DeleteModal from "./DeleteModal";
import DataTable from "../DataTable";

const PostList = ({
  posts,
  onAction,
  setOnAction,
  toggleAddSchedule,
  setSelectPost,
}) => {
  const location = useLocation();
  const [showDelModal, setShowDelModal] = useState(false);
  const [item, setItem] = useState(null);
  const [tableRows, setTableRows] = useState(null);

  const toggleDelModal = useCallback(
    (post) => {
      setShowDelModal(!showDelModal);
      setItem(post);
    },
    [showDelModal]
  );

  const addScheduleHander = useCallback(
    (post) => {
      setSelectPost(post);
      toggleAddSchedule();
    },
    [toggleAddSchedule, setSelectPost]
  );

  useEffect(() => {
    const renderTableRows = () => {
      var rowsData = [];
      posts.map((post, index) => {
        var rowItem = {};
        rowItem["id"] = (
          <Link to={`/edit-post/${post._id}`} searchvalue={post._id}>
            {post._id}
          </Link>
        );
        rowItem["title"] = post.title;
        rowItem["topic"] = post.topic.name;
        rowItem["lastUpdate"] = `${post.author.name} - ${new Date(
          post.last_updated_at
        ).toLocaleString("en-GB")}`;
        rowItem["action"] = (
          <div className="text-center">
            {/* <button
              type="button"
              className="btn btn-secondary m-1"
              onClick={() => addScheduleHander(post)}
            >
              <i className="fa fa-upload fa-sm text-gray-50" />
            </button> */}

            {location.pathname === "/post" && (
              <>
                <Link to={`/post/spinner/${post._id}`}>
                  <button type="button" className="btn btn-success m-1">
                    <i className="fa fa-sync fa-sm text-gray-50" />
                  </button>
                </Link>

                <Link
                  to={{
                    pathname: `/spin-post`,
                    fromPost: {
                      label: `${post._id} - ${post.title}`,
                      value: post._id,
                    },
                  }}
                >
                  <button type="button" className="btn btn-info m-1">
                    <i className="fa fa-eye fa-sm text-gray-50" />
                  </button>
                </Link>
              </>
            )}

            <button
              type="button"
              className="btn btn-danger m-1"
              onClick={() => toggleDelModal(post)}
            >
              <i className="fa fa-trash fa-sm text-gray-50" />
            </button>
          </div>
        );
        return rowsData.push(rowItem);
      });

      setTableRows(rowsData);
    };
    renderTableRows();
  }, [posts, toggleDelModal, addScheduleHander, location]);

  const data = {
    columns: [
      {
        label: "ID",
        field: "id",
        sort: "asc",
      },
      {
        label: "Tiêu đề",
        field: "title",
      },
      {
        label: "Chủ đề",
        field: "topic",
      },
      {
        label: "Lần cập nhật cuối",
        field: "lastUpdate",
      },
      {
        label: "Thao tác",
        field: "action",
        sort: "disabled",
      },
    ],

    rows: tableRows,
  };

  return (
    <>
      <DataTable data={data} sortValue={"id"} />

      {item && (
        <DeleteModal
          isOpen={showDelModal}
          toggle={toggleDelModal}
          post={item}
          onAction={onAction}
          setOnAction={setOnAction}
        />
      )}
    </>
  );
};

export default PostList;
