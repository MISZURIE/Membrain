/**
 * Alibaba Cloud OSS Client
 * Used for: storing Memory Obituaries in cold/immutable storage.
 *
 * TODO: Install @alicloud/oss and configure with real credentials.
 */

const OSS_BUCKET = process.env.OSS_BUCKET || 'membrain-obituaries';
const OSS_REGION = process.env.OSS_REGION || 'oss-ap-southeast-1';
const OSS_ENDPOINT = process.env.OSS_ENDPOINT || 'https://oss-ap-southeast-1.aliyuncs.com';

export interface OSSUploadResult {
  key: string;
  url: string;
  bucket: string;
}

/**
 * Upload a JSON obituary object to Alibaba OSS.
 * Returns the OSS key for future retrieval.
 */
export async function uploadObituary(
  memoryId: string,
  obituaryData: object
): Promise<OSSUploadResult> {
  const key = `obituaries/${memoryId}.json`;

  // TODO: Replace with actual Alibaba OSS SDK call
  console.log(`[OSS] Would upload obituary to ${OSS_BUCKET}/${key}`);

  return {
    key,
    url: `${OSS_ENDPOINT}/${OSS_BUCKET}/${key}`,
    bucket: OSS_BUCKET,
  };
}

/**
 * Retrieve an obituary from Alibaba OSS by key.
 */
export async function getObituary(key: string): Promise<object | null> {
  // TODO: Replace with actual Alibaba OSS SDK call
  console.log(`[OSS] Would retrieve obituary from ${OSS_BUCKET}/${key}`);
  return null;
}

export const ossConfig = {
  bucket: OSS_BUCKET,
  region: OSS_REGION,
  endpoint: OSS_ENDPOINT,
};
