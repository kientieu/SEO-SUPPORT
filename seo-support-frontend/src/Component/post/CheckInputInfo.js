export const checkInputInfo = (postTitle, postContent, selectedKw) => {
  var errorMsg = [];
  var warningMsg = [];

  if (postTitle.length < 15 || postTitle.length > 60) {
    errorMsg.push("Tiêu đề bài viết phải dài từ 15 đến 60 kí tự");
  }

  var urlRE = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\/%=~_|])/ig;
  if (postContent.match(urlRE)) {
    var matches = [...postContent.match(urlRE)];
    warningMsg.push(
      <span>
        Nội dung bài viết có chứa đường dẫn của trang web khác:
        <ul>
          {matches.map((item, index) => {
            return <li key={index}>{item}</li>;
          })}
        </ul>
      </span>
    );
  }

  var keywordRE = new RegExp(`(\\s|^)${selectedKw.label}[\\W]?(?=\\s|$)`, "gi");
  var rmHTMLTagContent = postContent.replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, " ");
  if (!rmHTMLTagContent.match(keywordRE)) {
    errorMsg.push("Nội dung bài viết chưa bao gồm từ khoá cần SEO");
  }

  return [errorMsg, warningMsg];
};
