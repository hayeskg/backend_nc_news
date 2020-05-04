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

describe('makeRefObj', () => { });

describe('formatComments', () => { });
