import encodeUrlParams from '../encode-url-params';

describe('utilities > encodeUrlParams', () => {
  test('transforms an object into a string of encoded url parameters', () => {
    expect(
      encodeUrlParams({q: 'abc 123', size: 20})
    ).toEqual(
      'q=abc%20123&size=20'
    );
  });

  test('transforms a set of objects into a string of encoded url parameters', () => {
    expect(
      encodeUrlParams({q: 'abc 123', size: 20}, {otherParam: '1e2q'})
    ).toEqual(
      'q=abc%20123&size=20&otherParam=1e2q'
    );
  });

  test('returns an empty string when no arguments are provided', () => {
    expect(
      encodeUrlParams()
    ).toEqual(
      ''
    );
  });
});
