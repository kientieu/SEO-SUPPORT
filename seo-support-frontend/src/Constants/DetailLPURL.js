const { REACT_APP_BE_URL } = process.env;

export const DetailLPURL = {
  getAdd: function (params) {
    return `${REACT_APP_BE_URL}/api/detail-lp/${params}`;
  },

  addExcel: function (lpId) {
    return `${REACT_APP_BE_URL}/api/detail-lp/${lpId}/excel`;
  },

  delKW: function (lpId) {
    return `${REACT_APP_BE_URL}/api/detail-lp/${lpId}`;
  },
};
