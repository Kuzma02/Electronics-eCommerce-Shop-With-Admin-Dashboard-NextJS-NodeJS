const formatCategoryName = (categoryName: string) => {
    const categoryNameArray = categoryName.split("-");
    return categoryNameArray.join(" ");
  };

  const convertCategoryNameToURLFriendly = (categoryName: string) => {
    const categoryNameArray = categoryName.split(" ");
    return categoryNameArray.join("-");
  };

export {formatCategoryName, convertCategoryNameToURLFriendly};