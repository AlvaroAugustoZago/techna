import { ConsoleLogger, HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TagGtplan } from './tag';

@Injectable()
export class GtplanService {
  private URL_BASE: string = 'https://restbus.gtplanqa.net/Erp_sku/';
  private HEADERS = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${new Buffer(
      '5A503DE94A258CF3E8D59FE8ADA56F2F' +
        ':' +
        'B59307FDACF7B2DB12EC4BD5CA1CABA8',
    ).toString('base64')}`,
  };
  constructor(private http: HttpService) {}

  sendMany(tags: Array<TagGtplan>): Observable<any> {
    return this.http
    .post(
      `${this.URL_BASE}?action=INSERT`,
      {
        DATA: tags,
      },
      { headers: this.HEADERS },
    )
  
  }

  send(tag: TagGtplan): void {
    this.http
      .post(
        `${this.URL_BASE}?action=INSERT`,
        {
          DATA: [tag],
        },
        { headers: this.HEADERS },
      )
      .subscribe((item) => console.log(item.data));
  }
}
