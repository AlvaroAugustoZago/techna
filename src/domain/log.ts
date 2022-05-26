import { Column, Entity } from "typeorm";

@Entity()
export class Log {

    @Column( {default: null, type: 'bigint'})
    dataAberturaPorta: string;

    static novo(): Log {
        const log: Log = new Log();
        log.dataAberturaPorta = new Date().getTime().toString();
        return log;
    }
}