import { AggregateRoot } from '@nestjs/cqrs';

export class Tag extends AggregateRoot {
  constructor(private id: string) {
    super();
  }

  killEnemy(enemyId: string) {
    // this.apply(new HeroKilledDragonEvent(this.id, enemyId));
  }
}
