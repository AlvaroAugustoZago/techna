export class Configurar {
  constructor(
    public readonly port: string,
    public readonly dbm: string,
    public readonly bip: boolean,
    public readonly seconds: number,
    public readonly password: string,
    public readonly tempoChecagem: number,
    public readonly tempoEspera: number
  ) {}

  static of(port, dbm, bip, seconds, password, tempoChecagem, tempoEspera): Configurar {
    return new Configurar(port, dbm, bip, seconds, password, tempoChecagem, tempoEspera);
  }
}
