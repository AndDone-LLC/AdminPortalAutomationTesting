import { BaseAPI, Header } from 'anddonejs1';

export class GetGASecureRequest extends BaseAPI {
  static async getAllGA({
    pageSize = 10,
    pageIndex = 1,
    name = '',
    merchantId // <-- Add merchantId as a parameter
  }: { pageSize?: number; pageIndex?: number; name?: string; merchantId: string },
    customHeaders?: Header
  ) {
    const baseUrl = BaseAPI.getBaseUrl2();
    const url = new URL('/pf/secure/ga', baseUrl);
    url.search = new URLSearchParams({
      PageSize: pageSize.toString(),
      PageIndex: pageIndex.toString(),
      Name: name
    }).toString();
    const apiurl = url.toString();

    // Standard secure headers
    const secureHeaders = {
      'x-api-key': process.env.env_merchantAccessKey || '',
      'Origin': process.env.origin_admin || '',
      'x-app-key': merchantId, // <-- Use dynamic merchantId here
      'x-version': process.env['x-version'] || '1.0',
      ...customHeaders
    };

    return BaseAPI.sendRequest(
      'GET',
      apiurl,
      {
        headers: secureHeaders
      }
    );
  }
}