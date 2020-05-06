process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app.js');
const connection = require('../db/connection');

beforeEach(() => { return connection.seed.run() });
afterAll(() => { return connection.destroy() });

describe('app', () => {
  describe('/api', () => {
    test('Status: 404 - Route not found when client tries a GET method on an incorrect path /topics/abc', () => {
      return request(app)
        .get('/api/topics/abc')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Route not found');
        })
    })
    describe('/topics', () => {
      describe('GET method', () => {
        test('Status:200 responds with array of topics objects', () => {
          return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
              expect(Array.isArray(body.topics)).toBe(true);
              expect(body.topics.length).toBe(3);
            });
        });
        test('Status:200 each topics object has slug and description properties', () => {
          return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
              body.topics.forEach((topic) => {
                expect(Object.keys(topic)).toEqual(expect.arrayContaining(['slug', 'description']));
              })
            })
        })
      });
    });
    describe('/users/:username', () => {
      describe('GET method', () => {
        test('Status:200 responds with the correct user object based on a username parametric endpoint', () => {
          return request(app)
            .get('/api/users/rogersop')
            .expect(200)
            .then(({ body }) => {
              expect(typeof body.user).toBe('object');
            });
        });
        test('Status:200 returned user object includes properties username, name and avatar_url', () => {
          return request(app)
            .get('/api/users/rogersop')
            .expect(200)
            .then(({ body }) => {
              expect(Object.keys(body.user)).toEqual(expect.arrayContaining(['username', 'name', 'avatar_url']));
            });
        });
        xtest('Status:400 Bad Request when incorrect username is passed', () => {
          return request(app)
            .get('/api/users/123') ///what is an incorrect username?
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Bad Request');
            })
        })
        test('Status:404 error message when GET request with non-existent username', () => {
          return request(app)
            .get('/api/users/notValidUsername')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('non-existent username: notValidUsername');
            })
        })
        xtest('Status:405 Method not allowed message when method other than GET used', () => {
          return request(app)
            .put('/api/users/rogersop') //routing related issue... need help
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).toBe('Method not allowed');
            })
        })
      });
    });
    describe('/articles/:article_id', () => {
      describe('GET method', () => {
        test('Status:200 responds with an article object', () => {
          return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
              expect(typeof body.article).toBe('object');
            });
        });
        test('Status:200 article object includes properties author, title, article_id, body, topic, created_at, votes, comment_count', () => {
          return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then(({ body }) => {
              expect(Object.keys(body.article)).toEqual(expect.arrayContaining(['author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count']));
              expect(body.article.article_id).toBe(1);
            });
        });
        test('Status:200 test for another article ID', () => {
          return request(app)
            .get('/api/articles/3')
            .expect(200)
            .then(({ body }) => {
              expect(Object.keys(body.article)).toEqual(expect.arrayContaining(['author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count']));
              expect(body.article.article_id).toBe(3);
            });
        });
        test('Status:404 error message when GET request with non-existent username', () => {
          return request(app)
            .get('/api/articles/3333333')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('No article found for article_id: 3333333');
            })
        })
        xtest('Status:400 error message when GET request with invalid article ID', () => {
          return request(app)
            .get('/api/articles/notValidArticleID')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('invalid input syntax for integer: "notValidArticleID"');
            })
        })
      });
      describe('PATCH method', () => {
        test('Status:200 takes a newVotes object and updates the votes of the given article, returns updated article object', () => {
          const newVote = { inc_votes: 10 };
          return request(app)
            .patch('/api/articles/3')
            .send(newVote)
            .expect(200)
            .then(({ body }) => {
              expect(Object.keys(body.article)).toEqual(expect.arrayContaining(['author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count']));
              expect(body.article.article_id).toBe(3);
              expect(body.article.votes).toEqual(10);
            });
        });
        test('Status:200 test with another article ID', () => {
          const newVote = { inc_votes: 20 };
          return request(app)
            .patch('/api/articles/1')
            .send(newVote)
            .expect(200)
            .then(({ body }) => {
              expect(Object.keys(body.article)).toEqual(expect.arrayContaining(['author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'comment_count']));
              expect(body.article.article_id).toBe(1);
              expect(body.article.votes).toEqual(120);
            });
        });
      });
    });
  });
});