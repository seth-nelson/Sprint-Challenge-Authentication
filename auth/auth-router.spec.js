/* eslint-disable no-undef */
const request = require('supertest');
const db = require('../database/dbConfig');
const server = require('../api/server');

describe('successful register and login', () => {
    beforeEach(async () => {
        await db('users').truncate();
        });
    it('status(201) if successfully registered', () => request(server)
        .post('/api/auth/register')
        .send({ username: 'test', password: 'test' })
        .then((res) => {
            expect(res.status).toBe(201);
    }));
    it('status(401) if missing parameters', () => request(server)
        .post('/api/auth/register')
        .send({ username: 'test' })
        .then((res) => {
            expect(res.status).toBe(401);
        }));
    it('status(401) if incorrect username or password', () => request(server)
        .post('/api/auth/login')
        .send({ username: 'eargerg', password: 'ergerag' })
        .then((res) => {
            expect(res.status).toBe(401);
    }));
});