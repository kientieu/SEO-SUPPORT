const { REACT_APP_BE_URL } = process.env;

export const KeywordURL = {
  getSearch: function (params) {
    return `${REACT_APP_BE_URL}/api/keywords?kwSearch=${params}`;
  },

  getAdd: `${REACT_APP_BE_URL}/api/keywords`,

  addExcel: `${REACT_APP_BE_URL}/api/keywords/excel`,

  getSortByDate: function (sort, order) {
    //sort: created_at; order: asc, desc
    return `${REACT_APP_BE_URL}/api/keywords?sort=${sort}&order=${order}`;
  },

  getTopTen: `${REACT_APP_BE_URL}/api/keywords/top-ten`,

  editDel: function (params) {
    return `${REACT_APP_BE_URL}/api/keywords/${params}`;
  },

  getEditDetails: function (params) {
    return `${REACT_APP_BE_URL}/api/edit-keyword/${params}`;
  },

  delLP: function (keywordId) {
    return `${REACT_APP_BE_URL}/api/edit-keyword/${keywordId}`;
  },
};
