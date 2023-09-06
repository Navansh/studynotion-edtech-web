const fetchData = require('../server/fetchData');

describe('fetchData', () => {
  it('fetches data successfully', async () => {
    const data = await fetchData();
    expect(data).toEqual({ someData: 'example' });
  });

  // Test for error handling can also be written
});
