import request from 'request-promise';

export const rendertron = {
  render: async (url: string): Promise<string> => {
    const response = await request(`${process.env.RENDERTRON_URL}/render/${url}`);
    return response;
  },
};
