class Dashboard {
  constructor() {
    this._incomes = [];
    this._expenses = [];
  }

  addIncome(amount) {
    if (typeof amount !== 'number' || Number.isNaN(amount) || amount < 0) {
      throw new TypeError('income must be a non-negative number');
    }
    this._incomes.push(amount);
  }

  addExpense(amount) {
    if (typeof amount !== 'number' || Number.isNaN(amount) || amount < 0) {
      throw new TypeError('expense must be a non-negative number');
    }
    this._expenses.push(amount);
  }

  getTotalIncome() {
    return this._incomes.reduce((s, v) => s + v, 0);
  }

  getTotalExpenses() {
    return this._expenses.reduce((s, v) => s + v, 0);
  }

  getBalance() {
    return this.getTotalIncome() - this.getTotalExpenses();
  }
}

module.exports = Dashboard;
