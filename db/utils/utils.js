exports.formatDates = (list, key) => {
  const objectsDateFormatted = list.map(obj => {
    return { ...obj };
  })
  objectsDateFormatted.forEach((obj) => {
    obj[key] = new Date(obj[key]);
  });
  return objectsDateFormatted;
};

exports.makeRefObj = list => { };

exports.formatComments = (comments, articleRef) => { };
