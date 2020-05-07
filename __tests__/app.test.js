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
      test('Status:405 Method not allowed message when method other than GET used', () => {
        return request(app)
          .put('/api/topics')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).toBe('Method not allowed');
          })
      })
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
      test('Status:405 Method not allowed message when method other than GET used', () => {
        return request(app)
          .put('/api/users/rogersop')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).toBe('Method not allowed');
          })
      })
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
        test('Status:404 error message when GET request with non-existent username', () => {
          return request(app)
            .get('/api/users/notValidUsername')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('non-existent username: notValidUsername');
            })
        })

      });
    });
    describe('/articles/:article_id', () => {
      test('Status:405 Method not allowed message when method other than GET/PATCH used', () => {
        return request(app)
          .del('/api/articles/3')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).toBe('Method not allowed');
          })
      })
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
        test('Status:400 Bad Request when invalid article ID is passed', () => {
          return request(app)
            .get('/api/articles/hellostring')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Bad Request');
            })
        })
        test('Status:404 error message when non-existent article ID is passed', () => {
          return request(app)
            .get('/api/articles/3333333')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('No article found for article_id: 3333333');
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
        test('Status:400 Bad Request when invalid article ID is passed', () => {
          const newVote = { inc_votes: 20 };
          return request(app)
            .patch('/api/articles/hellostring')
            .send(newVote)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Bad Request');
            });
        })
        test('Status:400 Bad Request when incorrect newVote object is passed', () => {
          const newVote = { blabla: 3 };
          return request(app)
            .patch('/api/articles/3')
            .send(newVote)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Bad Request');
            });
        })
        test('Status:404 error message when non-existent article ID is passed', () => {
          const newVote = { inc_votes: 20 };
          return request(app)
            .patch('/api/articles/12345')
            .send(newVote)
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('No article found for article_id: 12345');
            });
        })
      });

    });
    describe('/articles/:article_id/comments', () => {
      test('Status:405 Method not allowed message when method other than GET/POST used', () => {
        return request(app)
          .put('/api/articles/3/comments')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).toBe('Method not allowed');
          })
      })
      describe('GET method', () => {
        test('Status:200 Returns an array of comments for a valid article_id', () => {
          return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
              body.comments.forEach((comment) => {
                expect(Object.keys(comment)).toEqual(expect.arrayContaining(['comment_id', 'votes', 'created_at', 'author', 'body']));
              })
              expect(Array.isArray(body.comments)).toBe(true);
            });
        })
        test('Status:200 Accepts a sort_by query for any valid column - defaults to created_at descending', () => {
          return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).toBeSortedBy('created_at', {
                descending: true,
              });
            });
        })
        test('Status:200 Accepts a sort_by query for any valid column - tested with sort_by = author, ascending', () => {
          return request(app)
            .get('/api/articles/1/comments?sorted_by=author&order=asc')
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).toBeSortedBy('author');
            });
        })
        test('Status:400 Bad Request when invalid article ID is passed', () => {
          return request(app)
            .get('/api/articles/hellostring/comments')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Bad Request');
            })
        })
        test('Status:400 Bad Request message when invalid queries are passed', () => {
          return request(app)
            .get('/api/articles/3333333/comments?sorted_by=blabla&blababla')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Bad Request');
            })
        })
        test('Status:404 Resource Not Found error message when non-existent article ID is passed', () => {
          return request(app)
            .get('/api/articles/3333333/comments')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('No comments found for article_id: 3333333');
            })
        })
      })
    })
    describe('/articles', () => {
      test('Status:405 Method not allowed message when method other than GET used', () => {
        return request(app)
          .del('/api/articles')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).toBe('Method not allowed');
          })
      })
      describe('GET method', () => {
        test('Status:200 Returns an array of articles', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
              body.articles.forEach((article) => {
                expect(Object.keys(article)).toEqual(expect.arrayContaining(['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'comment_count']));
              })
              expect(Array.isArray(body.articles)).toBe(true);
            });
        })
        test('Status:200 Returns an array of articles, default to sorted by date created, descending', () => {
          return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy('created_at', {
                descending: true,
              });
            });
        })
        test('Status:200 Returns an array of articles, works for sorted by author ascending', () => {
          return request(app)
            .get('/api/articles?sorted_by=author&order=asc')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy('author');
            });
        })
        test('Status:200 Returns an array of articles, filters by author', () => {
          return request(app)
            .get('/api/articles?author=rogersop')
            .expect(200)
            .then(({ body }) => {
              body.articles.forEach((article) => {
                expect(article.author).toBe('rogersop');
              })
            });
        })
        test('Status:200 Returns an array of articles, filters by topic', () => {
          return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then(({ body }) => {
              body.articles.forEach((article) => {
                expect(article.topic).toBe('cats');
              })
            });
        })
        test('Status:400 Bad Request for invalid queries', () => {
          return request(app)
            .get('/api/articles?topic=notatopic&order=bla')
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Bad Request - invalid query.');
            })
        });
      });
    })
    describe.only('/comments/:comment_id', () => {
      test('Status:405 Method not allowed message when method other than PATCH/DEL used', () => {
        return request(app)
          .get('/api/comments/3')
          .expect(405)
          .then(({ body }) => {
            expect(body.msg).toBe('Method not allowed');
          })
      })
      describe('PATCH method', () => {
        test('Status:200 takes a newVotes object and updates the votes of the given comment, returns updated comment object', () => {
          const newVote = { inc_votes: 1 };
          return request(app)
            .patch('/api/comments/1')
            .send(newVote)
            .expect(200)
            .then(({ body }) => {
              expect(Object.keys(body.comment)).toEqual(expect.arrayContaining(['comment_id', 'author', 'article_id', 'votes', 'created_at', 'body']));
              expect(body.comment.votes).toBe(17);
            });
        });
        test('Status:200 takes a newVotes object and updates the votes of the given comment, returns updated comment object', () => {
          const newVote = { inc_votes: -20 };
          return request(app)
            .patch('/api/comments/3')
            .send(newVote)
            .expect(200)
            .then(({ body }) => {
              expect(Object.keys(body.comment)).toEqual(expect.arrayContaining(['comment_id', 'author', 'article_id', 'votes', 'created_at', 'body']));
              expect(body.comment.votes).toBe(80);
            });
        });
        test('Status:400 Bad Request when invalid comment ID is passed', () => {
          const newVote = { inc_votes: 20 };
          return request(app)
            .patch('/api/comments/hellostring')
            .send(newVote)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Bad Request');
            });
        })
        test('Status:400 Bad Request when incorrect newVote object is passed', () => {
          const newVote = { blabla: 3 };
          return request(app)
            .patch('/api/comments/3')
            .send(newVote)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe('Bad Request');
            });
        })
        test('Status:404 Resource Not Found error message when non-existent comment ID is passed', () => {
          const newVote = { inc_votes: 20 };
          return request(app)
            .patch('/api/comments/12345')
            .send(newVote)
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('No comment found for comment ID: 12345');
            });
        })
      })
      describe('DELETE method', () => { })
    })
  })

})
