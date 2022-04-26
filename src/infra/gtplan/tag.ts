import { Tag } from 'src/domain/tag';

export class TagGtplan {
  ID_COMPANY_FK: string;
  COD_TRANS_PK: string;
  COD_SERIE: string;
  COD_ITEM: string;
  COD_LOTE: string;
  COD_ESTAB: string;
  COD_LOCAL: string;
  ID_SUPPLIER: string;
  COD_ANTENA: string;
  TYPE_TRANS: string;
  DATE_TRANS: string;
  QTY_TRANS: string;

  public static of(tag: Tag): TagGtplan {
    const tagGtplan = new TagGtplan();

    tagGtplan.COD_ITEM = tag.produto;
    tagGtplan.COD_LOTE = tag.lote;
    tagGtplan.COD_ANTENA = tag.antena;
    tagGtplan.TYPE_TRANS = tag.movimento;

    //Entender esses valores com a GTPLAN
    tagGtplan.ID_COMPANY_FK = '3199';
    tagGtplan.COD_TRANS_PK = '123456789';
    tagGtplan.COD_SERIE = '10';
    tagGtplan.COD_ESTAB = '1';
    tagGtplan.COD_LOCAL = '10';
    tagGtplan.ID_SUPPLIER = '48088798000190';
    tagGtplan.DATE_TRANS = '13052021';
    tagGtplan.QTY_TRANS = '46';

    return tagGtplan;
  }
}
