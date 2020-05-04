exports.formatDates = (list, key) => {
  const objectsDateFormatted = list.map(obj => {
    return { ...obj };
  })
  objectsDateFormatted.forEach((obj) => {
    obj[key] = new Date(obj[key]);
  });
  return objectsDateFormatted;
};

exports.makeRefObj = (list, value, key) => {
  const copyArr = list.map(obj => {
    return { ...obj };
  });
  const refObj = {};
  copyArr.forEach(obj => {
    let newKey = obj[`${key}`];
    let newValue = obj[`${value}`];
    refObj[newKey] = newValue;
  });

  return refObj;
};

exports.formatComments = (comments, articleRef, keyToAdd, keyToRemove) => {
  const formattedComments = comments.map(obj => {
    return { ...obj };
  });
  formattedComments.forEach(obj => {
    obj[keyToAdd] = articleRef[obj[keyToRemove]];
    delete obj[keyToRemove];
    obj.author = obj.created_by;
    delete obj.created_by;
    obj.created_at = new Date(obj.created_at);

  })
  return formattedComments;
};
