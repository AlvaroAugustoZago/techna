import { ConsoleLogger, HttpService, Injectable } from '@nestjs/common';
import { TagGtplan } from './tag';

@Injectable()
export class GtplanService {
  private URL_BASE: string = 'https://restbus.gtplanqa.net/Erp_sku/';
  constructor(private http: HttpService) {}

  send(tag: TagGtplan): void {
    const headersRequest = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${new Buffer(
        '5A503DE94A258CF3E8D59FE8ADA56F2F' +
          ':' +
          'B59307FDACF7B2DB12EC4BD5CA1CABA8',
      ).toString('base64')}`,
    };
    this.http
      .post(
        `${this.URL_BASE}?action=INSERT`,
        {
          DATA: [tag],
        },
        { headers: headersRequest },
      )
      .subscribe((item) => console.log(item.data));
  }
}
