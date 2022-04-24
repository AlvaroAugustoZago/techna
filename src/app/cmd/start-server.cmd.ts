export class StartServer {
    constructor(
        public readonly port: string,
        public readonly dbm: string,
        public readonly bip: boolean,
        public readonly seconds: number,
        public readonly password: string
      ) {}

    static of(port, dbm, bip, seconds, password): StartServer {
        return new StartServer(port, dbm, bip,seconds, password);
    }    
}