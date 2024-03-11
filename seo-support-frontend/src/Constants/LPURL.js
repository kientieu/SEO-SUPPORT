const { REACT_APP_BE_URL } = process.env;

export const LPURL = {
  getAdd: function (params) {
    return `${REACT_APP_BE_URL}/api/landing-pages/${params}`;
  },

  addExcel: function (campaignId) {
    return `${REACT_APP_BE_URL}/api/landing-pages/${campaignId}/excel`;
  },

  getSearch: function (queryString) {
    return `${REACT_APP_BE_URL}/api/landing-pages${queryString}`;
  },

  editLock: function (params) {
    return `${REACT_APP_BE_URL}/api/landing-pages/modify/${params}`;
  },
};
