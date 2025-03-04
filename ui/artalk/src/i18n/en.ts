const en = {
  /* Editor */
  placeholder: 'Leave a comment',
  noComment: 'No Comment',
  send: 'Send',
  save: 'Save',
  nick: 'Nickname',
  email: 'Email',
  link: 'Website',
  emoticon: 'Emoji',
  preview: 'Preview',
  image: 'Image',
  refresh: 'Refresh',
  uploadImage: 'Upload Image',
  uploadFail: 'Upload Failed',
  commentFail: 'Failed to comment',
  restoredMsg: 'Content has been restored',
  onlyAdminCanReply: 'Only admin can reply',
  uploadLoginMsg: 'Please fill in your name and email to upload',

  /* List */
  counter: '{count} Comments',
  sortLatest: 'Latest',
  sortOldest: 'Oldest',
  sortBest: 'Best',
  sortAuthor: 'Author',
  openComment: 'Open Comment',
  closeComment: 'Close Comment',
  listLoadFailMsg: 'Failed to load comments',
  listRetry: 'Retry',
  loadMore: 'Load More',

  /* Comment */
  admin: 'Admin',
  reply: 'Reply',
  voteUp: 'Up',
  voteDown: 'Down',
  voteFail: 'Vote Failed',
  readMore: 'Read More',
  actionConfirm: 'Confirm',
  collapse: 'Collapse',
  collapsed: 'Collapsed',
  collapsedMsg: 'This comment has been collapsed',
  expand: 'Expand',
  approved: 'Approved',
  pending: 'Pending',
  pendingMsg: 'Pending, visible only to commenter.',
  edit: 'Edit',
  editCancel: 'Cancel Edit',
  delete: 'Delete',
  deleteConfirm: 'Confirm',
  pin: 'Pin',
  unpin: 'Unpin',

  /* Time */
  seconds: 'seconds ago',
  minutes: 'minutes ago',
  hours: 'hours ago',
  days: 'days ago',
  now: 'just now',

  /* Checker */
  adminCheck: 'Enter admin password:',
  captchaCheck: 'Enter the CAPTCHA to continue:',
  confirm: 'Confirm',
  cancel: 'Cancel',

  /* Sidebar */
  msgCenter: 'Messages',
  ctrlCenter: 'Admin',
  emailVerified: 'Email has been verified',

  /* General */
  frontend: 'Frontend',
  backend: 'Backend',
  loading: 'Loading',
  loadFail: 'Load Failed',
  editing: 'Editing',
  editFail: 'Edit Failed',
  deleting: 'Deleting',
  deleteFail: 'Delete Failed',
  reqGot: 'Request got',
  reqAborted: 'Request timed out or terminated unexpectedly',
  updateMsg: 'Please update Artalk {name} to get the best experience!',
  currentVersion: 'Current Version',
  ignore: 'Ignore',
  open: 'Open',
  openName: 'Open {name}',
}

export type I18n = typeof en
export type I18nKeys = keyof I18n

export default en
