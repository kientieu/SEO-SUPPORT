const ResultDetails = ({ result }) => {
  return (
    <>
      {result.code !== 200 ? (
        <>
          <p>{result.message}</p>
          <p>{result.error}</p>
        </>
      ) : (
        <>
          {result.data.authorUrl && (
            <div className="row m-3">
              <p className="col-sm-2">Tác giả:</p>
              <p className="col-sm-8 text-center">
                {result.data.author}
                {" - "}
                <a
                target="_blank"
                rel="noreferrer"
                href={result.data.authorUrl}
              >
                {result.data.authorUrl}
              </a>
              </p>
              
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
          {/* <div className="row m-3">
            <p className="col-sm-2">Ngày đăng:</p>
            <p className="col-sm-8 text-center">
              {new Date(result.data.postDate).toLocaleString("en-GB")}
            </p>
          </div> */}
        </>
      )}
    </>
  );
};

export default ResultDetails;
