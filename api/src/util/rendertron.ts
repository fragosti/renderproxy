import axios, { AxiosAdapter, AxiosResponse } from 'axios';

import logger from '../util/logger';

export const rendertron = {
  render: async (url: string): Promise<AxiosResponse> => {
    const response = await axios.get(`${process.env.RENDERTRON_URL}/render/${url}`);
    return response;
  }
}