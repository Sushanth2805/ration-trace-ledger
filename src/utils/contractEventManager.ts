
type EventListener = () => void;

export class ContractEventManager {
  private static instance: ContractEventManager;
  private transactionListeners: Array<EventListener> = [];

  private constructor() {}

  public static getInstance(): ContractEventManager {
    if (!ContractEventManager.instance) {
      ContractEventManager.instance = new ContractEventManager();
    }
    return ContractEventManager.instance;
  }

  public addTransactionListener(listener: EventListener): void {
    this.transactionListeners.push(listener);
  }

  public removeTransactionListener(listener: EventListener): void {
    const index = this.transactionListeners.indexOf(listener);
    if (index > -1) {
      this.transactionListeners.splice(index, 1);
    }
  }

  public notifyTransactionChange(): void {
    this.transactionListeners.forEach(listener => listener());
  }
}
