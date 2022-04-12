export class TagLida {
  constructor(
    public readonly tag: string,
    public readonly rssi: number,
    public readonly antena: number,
    public readonly count: number,
    public readonly readTime: string,
  ) {}

}
