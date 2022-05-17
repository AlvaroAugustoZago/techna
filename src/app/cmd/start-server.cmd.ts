export class StartServer {
    constructor(
        public readonly password: string,
        public readonly isUI: boolean = true
      ) {}

    static of(password): StartServer {
        return new StartServer(password);
    }    
}