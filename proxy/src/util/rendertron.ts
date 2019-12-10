import requestPromise from 'request-promise';

export const rendertron = {
  render: async (url: string, isMobile: boolean = false): Promise<string> => {
    let encodedUrl = url;
    const [base, queryParams] = url.split('?');
    if (queryParams) {
      encodedUrl = `${base}/${encodeURIComponent(`?${queryParams}`)}`;
    }
    let fullUrl = `${process.env.RENDERTRON_URL}/render/${encodedUrl}`;
    if (isMobile) {
      fullUrl += '?mobile=true';
    }
    const response = await requestPromise({
      method: 'GET',
      uri: fullUrl,
      simple: false,
    });
    return response;
  },
};
