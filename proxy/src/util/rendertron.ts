import requestPromise from 'request-promise';

export const rendertron = {
  render: async (url: string): Promise<string> => {
    let encodedUrl = url;
    const [base, queryParams] = url.split('?');
    if (queryParams) {
      encodedUrl = `${base}/${encodeURIComponent(`?${queryParams}`)}`;
    }
    const fullUrl = `${process.env.RENDERTRON_URL}/render/${encodedUrl}`;
    const response = await requestPromise({
      method: 'GET',
      uri: fullUrl,
      simple: false,
    });
    return response;
  },
};
