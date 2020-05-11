process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app.js');
const connection = require('../db/connection');

beforeEach(() => { return connection.seed.run() });
afterAll(() => { return connection.destroy() });

describe('app', () => {
  describe('/api', () => {
    test('Status:200 GET request responds with a list of available API endpoints', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(typeof body).toBe('object');
        })
    })
    test('Status:404 - Route not found when client tries an incorrect endpoint path', () => {
      return request(app)
        .get('/api/whatever')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Route not found');
        })
    })
    test('Status:405 - Method Not Allowed message when client tries to use a method on /api', () => {
      return request(app)
        .del('/api')
        .expect(405)
        .then(({ body }) => {
          expect(body.msg).toBe('Method not allowed');
        })
    })
    describe('/topics', () => {
      test('Status:404 - Route not found when client tries an incorrect endpoint path', () => {
        return request(app)
          .get('/api/topics/whatever')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Route not found');
          })
      })
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
        test('Status:200 works with another valid user', () => {
          return request(app)
            .get('/api/users/lurker')
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
              expect(body.comments).toBeSortedBy('created_at', { descending: true });
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
        test('Status:200 Accepts a sort_by query for any valid column - tested with sort_by = votes, ascending', () => {
          return request(app)
            .get('/api/articles/1/comments?sorted_by=votes')
            .expect(200)
            .then(({ body }) => {
              expect(body.comments).toBeSortedBy('votes', { descending: true });
              expect(body.comments[0].comment_id).toBe(3);
            });
        })
        test('Status:200 Returns an empty comments array when no comments are available for a valid article_id', () => {
          return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then(({ body }) => {
              expect(body.comments.length).toBeSortedBy(0);
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
        test('Status:404 Resource Not Found error message when non-existent article ID is passed', () => {
          return request(app)
            .get('/api/articles/3333333/comments')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('No comments found for article_id: 3333333');
            })
        })
      })
      describe('POST method', () => {
        test('Status:201 Takes accepts a newComment object and responsds with a newly posted comment', () => {
          const newComment = { username: 'lurker', body: 'Just here for the peace and quiet!' }
          return request(app)
            .post('/api/articles/3/comments')
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
              expect(Object.keys(body.comment)).toEqual(expect.arrayContaining(['comment_id', 'author', 'article_id', 'votes', 'created_at', 'body']));
              expect(body.comment.author).toBe('lurker');
              expect(body.comment.comment_id).toBe(19);
            })
        })
        test('Status:201 Works with another username', () => {
          const newComment = { username: 'rogersop', body: 'Another awesome comment!' }
          return request(app)
            .post('/api/articles/5/comments')
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
              expect(Object.keys(body.comment)).toEqual(expect.arrayContaining(['comment_id', 'author', 'article_id', 'votes', 'created_at', 'body']));
              expect(body.comment.author).toBe('rogersop');
              expect(body.comment.comment_id).toBe(19);
            })
        })
        test('Status:400 Bad Request when incorrect POST newComment object', () => {
          const newComment = {}
          return request(app)
            .post('/api/articles/5/comments')
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toEqual(`Not possible to post comment.`);
            })
        })
        test('Status:400 Route not found for out of range article ID', () => {
          const newComment = {}
          return request(app)
            .post('/api/articles/not-valid-id/comments')
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toEqual('Bad Request');
            })
        })
        test('Status:404 Route not found for out of range article ID', () => {
          const newComment = {}
          return request(app)
            .post('/api/articles/1000000/comments')
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toEqual('Article ID not found.');
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
              expect(body.articles).toBeSortedBy('created_at', { descending: true, });
            });
        })
        test('Status:200 Returns an array of articles, works for sorted by author descending', () => {
          return request(app)
            .get('/api/articles?sorted_by=author')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy('author', { descending: true, });
              expect(body.articles[0].author).toBe('rogersop')
            });
        })
        test('Status:200 Returns an array of articles, works for sorted by author ascending', () => {
          return request(app)
            .get('/api/articles?sorted_by=author&order=asc')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles).toBeSortedBy('author');
              expect(body.articles[0].author).toBe('butter_bridge')
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
        test('Status:200 Returns an empty array of articles, if author has no articles', () => {
          return request(app)
            .get('/api/articles?author=lurker')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).toBe(0);

            });
        })
        test('Status:200 Returns an array of articles, filters by topic', () => {
          return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).toBe(1);
            });
        })
        test('Status:200 Returns an array of articles, filters by topic', () => {
          return request(app)
            .get('/api/articles?topic=paper')
            .expect(200)
            .then(({ body }) => {
              expect(body.articles.length).toBe(0);
            });
        })
        test('Status:404 Bad Request for invalid queries', () => {
          return request(app)
            .get('/api/articles?topic=notatopic')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('Bad Request - invalid query.');
            })
        });
        test('Status:404 Bad Request for invalid username', () => {
          return request(app)
            .get('/api/articles?author=notanauthor')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('Bad Request - invalid query.');
            })
        });
      });
    })
    describe('/comments/:comment_id', () => {
      test('Status:404 - Route not found when client tries an incorrect endpoint path', () => {
        return request(app)
          .get('/api/comments/')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Route not found');
          })
      })
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
      describe('DELETE method', () => {
        test('Status:204 Delete a comment based on valid comment ID', () => {
          return request(app)
            .del('/api/comments/11')
            .expect(204)
        })
        test('Status:404 Comment not found when incorrect comment ID passed', () => {
          return request(app)
            .del('/api/comments/99')
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe('Comment not found.');
            })
        })
      })
    })
  })
})
