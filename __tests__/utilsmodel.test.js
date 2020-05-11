process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app.js');
const connection = require('../db/connection');

const {
  isValuePresentInTableColumn,
} = require('../models/utils.model');

beforeEach(() => { return connection.seed.run() });
afterAll(() => { return connection.destroy() });


describe('isValuePresentInTableColumn', () => {
  test('Takes a table name, column name and value and returns a boolean', () => {
    return isValuePresentInTableColumn('articles', 'author', 'lurker').then((response) => {
      expect(response).toBe(false);
    })
  })
  test('Works for true', () => {
    return isValuePresentInTableColumn('articles', 'author', 'butter_bridge').then(isPresent => {
      expect(isPresent).toBe(true);
    })
  })
  test('Works for another table and inputs', () => {
    return isValuePresentInTableColumn('comments', 'article_id', '2').then(isPresent => {
      expect(isPresent).toBe(false);
    })
  })
})