const request = require('supertest');
const express = require('express');
const routes = require('../server/routes');

const app = express();
app.use('/', routes);

describe('GET /data', () => {
  it('responds with JSON containing fetched data', async () => {
    const response = await request(app).get('/data');
    expect(response.status).toEqual(200);
    expect(response.body).toEqual({ someData: 'example' });
  });

  it('handles errors', async () => {
    const mockFetchData = jest.fn(() => {
      throw new Error('Test error');
    });
    jest.mock('../server/fetchData', () => mockFetchData);

    const response = await request(app).get('/data');
    expect(response.status).toEqual(500);
    expect(response.body).toEqual({ message: 'Error fetching data' });
  });
});
