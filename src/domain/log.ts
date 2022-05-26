import { Column, Entity, PrimaryColumn } from "typeorm";
import {v4 as uuidv4} from 'uuid';

@Entity()
export class Log {
    
    @PrimaryColumn()
    id: string;

    @Column( {default: null, type: 'bigint'})
    dataAberturaPorta: string;

    static novo(): Log {
        const log: Log = new Log();
        log.id = uuidv4();
        log.dataAberturaPorta = new Date().getTime().toString();
        return log;
    }
}