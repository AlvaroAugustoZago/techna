export class Configurar {
    constructor(
        public readonly port: string,
        public readonly dbm: string,
        public readonly bip: boolean,
        public readonly seconds: number
      ) {}

    static of(port, dbm, bip, seconds): Configurar {
        return new Configurar(port, dbm, bip,seconds);
    }    
}