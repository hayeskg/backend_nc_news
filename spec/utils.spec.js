const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('Take an array of objects and return a new array', () => {
    expect(formatDates([])).toEqual([]);
    expect(typeof formatDates([{}])).toBe('object');
  });
  it('Takes an array of a single object the key name which need formatting, returns an array of a single element with it`s timestamp correctly formatted to JSON Date/Time', () => {
    const input = [{
      body: 'This morning, I showered for nine minutes.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 975242163389,
    }];
    const out = [{
      body: 'This morning, I showered for nine minutes.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'butter_bridge',
      votes: 16,
      created_at: new Date(975242163389),
    }];
    expect(formatDates(input, 'created_at')).toEqual(out);
  })
  it('Takes an array of multiple objects and the key which needs formatting, return an array with the timestamp correctly changed to JSON Date/Time', () => {
    const input = [{
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389,
    },
    {
      body:
        'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'butter_bridge',
      votes: 14,
      created_at: 1479818163389,
    }];
    const output = [{
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: new Date(1511354163389),
    },
    {
      body:
        'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'butter_bridge',
      votes: 14,
      created_at: new Date(1479818163389),
    }];
    expect(formatDates(input, 'created_at')).toEqual(output);

  })
  it('Does not mutate original input and returns new object', () => {
    const input = [{
      body: 'This morning, I showered for nine minutes.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 975242163389,
    }];
    const out = formatDates(input);
    expect(input).toEqual([{
      body: 'This morning, I showered for nine minutes.',
      belongs_to: 'Living in the shadow of a great man',
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 975242163389,
    }]);
    expect(out).not.toBe(input);

  })
});

describe('makeRefObj', () => {
  it('Takes an array, a key and a value and returns an reference object', () => {
    expect(makeRefObj([], 'key', 'value')).toEqual({});
  });
  it('Takes an array containing a single object, key and value inputs and returns an the correct reference object', () => {
    expect(makeRefObj([{ article_id: 1, title: 'A' }], 'article_id', 'title')).toEqual({ 'A': 1 })
  });
  it('Works with an input array of multiple objects, returns a larger lookup object', () => {
    expect(makeRefObj([
      { article_id: 1, title: 'A' },
      { article_id: 2, title: 'B' },
      { article_id: 3, title: 'C' },
      { article_id: 4, title: 'D' },
    ], 'article_id', 'title')).toEqual({ 'A': 1, 'B': 2, 'C': 3, 'D': 4 });
  });
  it('Does not mutate the original inputs, returns new object', () => {
    const input = [{ article_id: 1, title: 'A' }];
    expect(makeRefObj(input)).not.toBe(input);
    expect(input).toEqual([{ article_id: 1, title: 'A' }]);
  })
});

describe('formatComments', () => {
  it('Takes an array of comments and a lookup object, return a formatted array of objects', () => {
    expect(formatComments([], {}, 'keyToAdd', 'keyToRemove')).toEqual([]);
  })
  it('Takes an an array of a single comment object, lookup object and keys to change, return the correctly formatted array of comment object', () => {
    const input = [{
      body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
      belongs_to: 'Making sense of Redux',
      created_by: 'grumpy19',
      votes: 7,
      created_at: 1478813209256,
    }];
    const out = [{
      body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
      article_id: 4,
      author: 'grumpy19',
      votes: 7,
      created_at: new Date(1478813209256),
    }];
    const lookup = { 'Making sense of Redux': 4 };
    expect(formatComments(input, lookup, 'article_id', 'belongs_to')).toEqual(out);
  })
  it('Works for an input array of multiple elements, produces correctly formatted array of comment objects', () => {
    const input = [{
      body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
      belongs_to: 'Making sense of Redux',
      created_by: 'grumpy19',
      votes: 7,
      created_at: 1478813209256,
    }, {
      body: 'Dolorem excepturi quaerat. Earum dolor sapiente aut.',
      belongs_to: '22 Amazing open source React projects',
      created_by: 'grumpy19',
      votes: 2,
      created_at: 1469845535163,
    }
    ];
    const out = [{
      body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
      article_id: 4,
      author: 'grumpy19',
      votes: 7,
      created_at: new Date(1478813209256),
    }, {
      body: 'Dolorem excepturi quaerat. Earum dolor sapiente aut.',
      article_id: 3,
      author: 'grumpy19',
      votes: 2,
      created_at: new Date(1469845535163),
    }];
    const lookup = { 'Making sense of Redux': 4, '22 Amazing open source React projects': 3 };
    console.log(formatComments(input, lookup, 'article_id', 'belongs_to'));
    expect(formatComments(input, lookup, 'article_id', 'belongs_to')).toEqual(out);
  })
  it('Does not mutate the original input array and returns a new object', () => {
    input = [{
      body: 'Dolorem excepturi quaerat. Earum dolor sapiente aut.',
      article_id: 3,
      author: 'grumpy19',
      votes: 2,
      created_at: new Date(1469845535163),
    }];
    lookup = { '22 Amazing open source React projects': 3 };
    const out = formatComments(input, lookup, 'article_id', 'belongs_to');
    expect(out).not.toBe(input);
    expect(input).toEqual([{
      body: 'Dolorem excepturi quaerat. Earum dolor sapiente aut.',
      article_id: 3,
      author: 'grumpy19',
      votes: 2,
      created_at: new Date(1469845535163),
    }]);
    expect(lookup).toEqual({ '22 Amazing open source React projects': 3 });
  })
});
