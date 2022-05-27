import { ConsoleLogger, HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TagGtplan } from './tag';

@Injectable()
export class GtplanService {
  private URL_BASE: string = 'https://restbus.gtplanqa.net/Erp_transaction_rfid/';

  private HEADERS = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${new Buffer(
      '634E048B0B8D605B4D475040446FE529' +
        ':' +
        '43EC517D68B6EDD3015B3EDC9A11367B',
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
