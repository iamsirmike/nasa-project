const DEFAULT_PAGE_LIMIT = 0;
const DEFAULT_PAGE = 1;

//This is a pagination function
function getPagination(queryParams) {
  const page = Math.abs(queryParams.page) || DEFAULT_PAGE;
  const limit = Math.abs(queryParams.limit) || DEFAULT_PAGE_LIMIT;
  const skip = (page - 1) * limit;

  return {
    skip,
    limit,
  };
}

module.exports = getPagination;
