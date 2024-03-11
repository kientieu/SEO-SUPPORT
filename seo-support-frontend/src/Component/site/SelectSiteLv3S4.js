const SelectSiteLv3S4 = ({ result }) => {
  return (
    <>
      {result && (
        <div className="card shadow mb-4">
          {result.code === 200 ? (
            <>
              <h4 className="m-3 text-center font-italic">
                <i
                  className="fas fa-check-circle fa-2x fa-fw"
                  style={{ color: "green", verticalAlign: "middle" }}
                ></i>
                {result.message}
              </h4>
              <hr />
              {result.data.resultId && (
                <div className="row m-3">
                  <p className="col-sm-2">Mã kết quả:</p>
                  <a
                    className="col-sm-8 text-center"
                    target="_blank"
                    rel="noreferrer"
                    href={`/post/results/${result.data.resultId}`}
                  >
                    {result.data.resultId}
                  </a>
                </div>
              )}
              <div className="row m-3">
                <p className="col-sm-2">Tác giả:</p>
                <p className="col-sm-8 text-center">{result.data.author}</p>
              </div>
              {result.data.authorUrl && (
                <div className="row m-3">
                  <p className="col-sm-2">Link tác giả:</p>
                  <a
                    className="col-sm-8 text-center"
                    target="_blank"
                    rel="noreferrer"
                    href={result.data.authorUrl}
                  >
                    {result.data.authorUrl}
                  </a>
                </div>
              )}
              <div className="row m-3">
                <p className="col-sm-2">Link bài viết trên site vệ tinh:</p>
                <a
                  className="col-sm-8 text-center"
                  target="_blank"
                  rel="noreferrer"
                  href={result.data.postAtSiteUrl}
                >
                  {result.data.postAtSiteUrl}
                </a>
              </div>
              <div className="row m-3">
                <p className="col-sm-2">Ngày đăng:</p>
                <p className="col-sm-8 text-center">
                  {new Date(result.data.postDate).toLocaleString("en-GB")}
                </p>
              </div>
            </>
          ) : (
            <>
              <h4 className="m-3 text-center font-italic">
                <i
                  className="fas fa-exclamation-circle fa-2x fa-fw"
                  style={{ color: "red", verticalAlign: "middle" }}
                ></i>
                {result.message}
              </h4>
              <hr />
              <div className="row m-3">
                <p className="col-sm-2">Lỗi:</p>
                <p className="col-sm-8 text-center">{result.error}</p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default SelectSiteLv3S4;
