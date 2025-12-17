export default class ReputationSystem {
  private rep: number = 0;
  accumulate(delta: number) { this.rep += delta; }
  get() { return this.rep; }
  load(rep: number) { this.rep = rep; }
}