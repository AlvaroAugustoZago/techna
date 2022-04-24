import { ConsoleLogger, HttpService, Injectable } from '@nestjs/common';

@Injectable()
export class GtplanService {
  private URL_BASE: string = 'https://restbus.gtplanqa.net/Erp_sku/';
  constructor(private http: HttpService) {}

  send(): void {
    const headersRequest = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${new Buffer(
        '5A503DE94A258CF3E8D59FE8ADA56F2F' +
          ':' +
          'B59307FDACF7B2DB12EC4BD5CA1CABA8',
      ).toString('base64')}`,
    };
    this.http.post(
      `${this.URL_BASE}?action=INSERT`,
      {
        DATA: [
          {
            ID_COMPANY_FK: '3199',
            COD_TRANS_PK: '123456789',
            COD_SERIE: '10',
            COD_ITEM: '2038548',
            COD_LOTE: '1115544',
            COD_ESTAB: '1',
            COD_LOCAL: '10',
            ID_SUPPLIER: '48088798000190',
            COD_ANTENA: '520',
            TYPE_TRANS: 'E',
            DATE_TRANS: '13052021',
            QTY_TRANS: '46',
          },
          {
            ID_COMPANY_FK: '3199',
            COD_TRANS_PK: '123456788',
            COD_SERIE: '11',
            COD_ITEM: '2038511',
            COD_LOTE: '1115987',
            COD_ESTAB: '1',
            COD_LOCAL: '10',
            ID_SUPPLIER: '48088798000190',
            COD_ANTENA: '520',
            TYPE_TRANS: 'S',
            DATE_TRANS: '13052021',
            QTY_TRANS: '20',
          },
        ],
      },
      { headers: headersRequest },
    ).subscribe(item => console.log(item.data));
  }
}
