const { REACT_APP_BE_URL } = process.env;

export const ScheduleURL = {
  getAddAutoSch: `${REACT_APP_BE_URL}/api/schedules/auto`,
  
  getAll: `${REACT_APP_BE_URL}/api/schedules`,

  getManualSch: `${REACT_APP_BE_URL}/api/schedules/manual`,

  getDetails: function(schId) {
    return `${REACT_APP_BE_URL}/api/schedule-detail/auto/${schId}`
  },

  cancelAutoSch: function (schId) {
    return `${REACT_APP_BE_URL}/api/schedules/auto/cancel/${schId}`
  },

  countPostsOfSite: `${REACT_APP_BE_URL}/api/schedules/count-posts-of-site`,
}