## Test Output

Read through all errors. Note that any failing test could be caused by a problem uncovered in a previous test on the same endpoint.

### GET `/api/articles?sort_by=author`

Assertion: expected 'butter_bridge' to equal 'rogersop'

Hints:

- accept a `sort_by` query, with a value of any column name
- use `author` for the column to store the username that created the article

### GET `/api/articles?author=lurker`

Assertion: expected 400 to equal 200

Hints:

- give a 200 status and an empty array when articles for a topic that does exist, but has no articles is requested
- use a separate model to check whether the user exists

### GET `/api/articles?topic=paper`

Assertion: expected 400 to equal 200

Hints:

- give a 200 status and an empty array when articles for a topic that does exist, but has no articles is requested
- use a separate model to check whether the topic exists

### GET `/api/articles?topic=not-a-topic`

Assertion: expected 400 to equal 404

Hints:

- use a 404 status code, when provided a non-existent topic
- use a separate model to check whether the topic exists

### GET `/api/articles?author=not-an-author`

Assertion: expected 400 to equal 404

Hints:

- use a 404 status code, when provided a non-existent author
- use a separate model to check whether the author exists

### GET `/api/articles/1/comments?sort_by=votes`

Assertion: expected 2 to equal 3

Hints:

- accept a `sort_by` query of any valid column
- order should default to `DESC`

### GET `/api/articles/2/comments`

Assertion: expected 404 to equal 200

Hints:

- return 200: OK when the article exists
- serve an empty array when the article exists but has no comments

### POST `/api/articles/1/comments`

Assertion: expected 405 to equal 201

Hints:

- use a 201: Created status code for a successful `POST` request

### POST `/api/articles/1/comments`

Assertion: expected { msg: 'Method not allowed' } to contain key 'comment'

Hints:

- send the new comment back to the client in an object, with a key of comment: `{ comment: {} }`
- ensure all columns in the comments table match the README

### POST `/api/articles/1/comments`

Assertion: Cannot read property 'votes' of undefined

Hints:

- default `votes` to `0` in the migrations
- default `created_at` to the current time in the migrations

### POST `/api/articles/1/comments`

Assertion: expected 405 to equal 400

Hints:

- use a 400: Bad Request status code when `POST` request does not include all the required keys
- use `notNullable` in migrations for required columns

### POST `/api/articles/10000/comments`

Assertion: expected 405 to be one of [ 404, 422 ]

Hints:

- use a 404: Not Found _OR_ 422: Unprocessable Entity status code when `POST` contains a valid article ID that does not exist

### POST `/api/articles/not-a-valid-id/comments`

Assertion: expected 405 to equal 400

Hints:

- use a 400: Bad Request when `POST` contains an invalid article_id

### DELETE `/api`

Assertion: expected 404 to equal 405

Hints:

- use `.all()` on each route, to serve a 405: Method Not Found status code
