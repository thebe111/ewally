const req = require('supertest');
const app = require('./../src/app');

it(`scenario: valid bank bonds bar code
    given:
        - a bank bonds digitable line
    when:
        - the digitable line validation not raise errors
    then:
        - should return bar code, expiration date and amount 
`, async () => {
    const digitableLine = '21290001192110001210904475617405975870000002000'

    const res = await req(app).get(`/boleto/${digitableLine}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
        barCode: '21299758700000020000001121100012100447561740',
        amount: '20.00',
        expirationDate: '2018-07-16'
    });
})

it(`scenario: invalid digitable line 
    given:
        - a bank bonds digitable line
    when:
        - the digitable line contains non-digit values
    then:
        - should raise invalid digitable line error
`, async () => {
    const digitableLine = '0019050095401448160690680935031433737000000010a'

    const res = await req(app).get(`/boleto/${digitableLine}`);

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({
        error: true,
        message: `Invalid digitable line: ${digitableLine}`
    });
})

it(`scenario: invalid digitable line
    given:
        - a bank bonds digitable line
    when:
        - the digitable line block verifying digits not match
    then:
        - should raise invalid block error
`, async () => {
    const digitableLine = '00190500944014481606906809350314337370000000100';
    const block = '001905009';

    const res = await req(app).get(`/boleto/${digitableLine}`);

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({
        error: true,
        message: `Invalid block: ${block}`
    });
})

it(`scenario: invalid bar code
    given:
        - a bank bonds digitable line
    when:
        - extract the bar code from digitable line
    then:
        - should raise invalid bar code
`, async () => {
    const digitableLine = '00190500954014481606906809350314237370000000100';
    const barCode = '0019373700000001000500940144816060680935031';

    const res = await req(app).get(`/boleto/${digitableLine}`);

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({
        error: true,
        message: `Invalid bar code: ${barCode}`
    });
})

it(`scenario: valid dealer payment bar code
    given:
        - a dealer payment digitable line
    when:
        - the digitable line validation not raise errors
    then:
        - should return bar code and amount 
`, async () => {
    const digitableLine = '817700000000010936599702411310797039001433708318';

    const res = await req(app).get(`/boleto/${digitableLine}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
        barCode: '81770000000010936599704113107970300143370831',
        amount: '0.10'
    });
})

it(`scenario: invalid digitable line
    given:
        - a dealer payment digitable line
    when:
        - the digitable line block verifying digits not match
    then:
        - should raise invalid block error
`, async () => {
    const digitableLine = '817700000001010936599702411310797039001433708318';
    const block = '81770000000';

    const res = await req(app).get(`/boleto/${digitableLine}`);

    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({
        error: true,
        message: `Invalid block: ${block}`
    });
})

