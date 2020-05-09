const knex = require('../db/connection');

exports.isValuePresentInTableColumn = (table, column, value) => {
  return knex
    .select(`*`)
    .from(`${table}`)
    .where(`${column}`, `${value}`)
    .then((response) => {
      if (response.length === 0) {
        return false;
      } else {
        return true;
      }
    })
};