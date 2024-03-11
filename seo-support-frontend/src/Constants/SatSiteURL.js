const { REACT_APP_BE_URL } = process.env;

export const SatSiteURL = {
  getAddSatSite: `${REACT_APP_BE_URL}/api/sat-sites`,
  
  getAddSiteDetail: function(params) {
    return `${REACT_APP_BE_URL}/api/site-detail/${params}`;
  },

  postToSite: function(siteName, siteLevel) {
    return `${REACT_APP_BE_URL}/api/sat-sites/post-to?site=${siteName}&level=${siteLevel}`
  },

  addSiteAcc: `${REACT_APP_BE_URL}/api/site-acc`,
}