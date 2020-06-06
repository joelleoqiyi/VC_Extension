function getCurrDate(next) {
  var today = new Date();
  var ret = new Date(today.getTime() + (next * 24 * 60 * 60 * 1000));
  var dd = String(ret.getDate()).padStart(2, '0');
  var mm = String(ret.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = ret.getFullYear();

  ret = mm + '/' + dd + '/' + yyyy;
  return ret;
}

export {getCurrDate};
