export class StartServer {
    constructor(
        public readonly password: string
      ) {}

    static of(password): StartServer {
        return new StartServer(password);
    }    
}