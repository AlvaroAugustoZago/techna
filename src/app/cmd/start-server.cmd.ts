export class StartServer {
    constructor(
        public readonly port: string,
        public readonly dbm: string,
        public readonly bip: boolean,
        public readonly seconds: number,
      ) {}

    static of(port, dbm, bip, seconds): StartServer {
        return new StartServer(port, dbm, bip,seconds);
    }    
}