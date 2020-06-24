/* eslint-disable no-undef */
const request = require('supertest');

const server = require('../api/server');

describe('jokes router get request', () => {
    it('status(401) for no auth', () => request(server)
        .get('/api/jokes')
        .then((res) => {
            expect(res.status).toBe(401);
        }));
    it('returns json type', () => request(server)
        .get('/api/jokes')
        .then((res) => {
            expect(res.type).toBe('application/json');
        }));
});