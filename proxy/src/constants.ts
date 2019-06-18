export const requestTypesToRedirect = new Set([
  'css',
  'jpeg',
  'jpg',
  'css',
  'gif',
  'tiff',
  'svg',
  'png',
  'pdf',
  'doc',
  'docx',
  'mpeg',
  'wmv',
  'avi',
  'mp4',
  'm4a',
  'm4v',
  'f4v',
  'f4a',
  'm4b',
  'm4r',
  'f4b',
  'mov',
  '3gp',
  '3gp2',
  '3g2',
  'ogg',
  'oga',
  'oga',
  'ogx',
]);

export const TLS_CONNECTION_PORT = 443;

export const AWS_CREDENTIALS = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};
