const { REACT_APP_BE_URL } = process.env;

export const CampaignURL = {
  getAdd: `${REACT_APP_BE_URL}/api/campaigns`,

  addExcel: `${REACT_APP_BE_URL}/api/campaigns/excel`,

  editLock: function (params) {
    return `${REACT_APP_BE_URL}/api/campaigns/modify/${params}`;
  },

  getClosed: `${REACT_APP_BE_URL}/api/campaigns/closed`,
};
