import forOwn from 'lodash/fp/forOwn';

/*
  Usage:
  
  encodeUrlParams({q: 'abc 123', size: 20}, {otherParam: '1e2q'});
  returns 'q=abc%20%123&size=20&otherParam=1e2q'
*/
const encodeUrlParams = (...params) => {
  const allParams = Object.assign({}, ...params);

  return Object.entries(allParams)
    .reduce((urlEncodedParams, current) => {
      const key = current[0];
      const value = current[1];

      return [...urlEncodedParams, `${key}=${encodeURIComponent(value)}`];
    }, [])
    .join('&');
};

export default encodeUrlParams;
