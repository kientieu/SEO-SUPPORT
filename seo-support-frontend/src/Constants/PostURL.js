const { REACT_APP_BE_URL } = process.env;

export const PostURL = {
  getAdd: `${REACT_APP_BE_URL}/api/posts`,

  getOriginPosts: `${REACT_APP_BE_URL}/api/origin-posts`,

  getSpinPosts: `${REACT_APP_BE_URL}/api/spin-posts`,

  getSpinPostsByOriginId: function(originId) {
    return `${REACT_APP_BE_URL}/api/spin-posts?origin=${originId}`
  },

  getDetails: function(params) {
    return `${REACT_APP_BE_URL}/api/post/${params}`;
  },

  getPostSpinner: function(postId, spinNum) {
    return `${REACT_APP_BE_URL}/api/post/spinner/${postId}?spin=${spinNum}`;
  },

  addPostSpinner: function(postId) {
    return `${REACT_APP_BE_URL}/api/post/spinner/${postId}`;
  },

  editDel: function(params) {
    return `${REACT_APP_BE_URL}/api/post/modify/${params}`;
  },

  checkPostExistSch: function(params) {
    return `${REACT_APP_BE_URL}/api/post/modify/check/${params}`;
  },

  scorePost: `${REACT_APP_BE_URL}/api/post/auto-score`,
}