const request = require('supertest')
const app = require('../src/app')

beforeAll(done => {
    //TODO: wipe db
    done()
})

afterAll(done => {
    //TODO: Closing the DB connection allows Jest to exit successfully.

    done()
})

test('should not fail', async () => {

    const res = await request(app).post('/register').send({
        "email": "wimmer@wimmer.de",
        "password": "test123!",
        "name": "Friedrich Wimmer der Echte",
        "clubs": []
    })
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
})