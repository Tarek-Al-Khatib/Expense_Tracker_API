import React, { useEffect, useState } from "react";
import "./App.css";
import "./base/base.css";
import "./base/colors.css";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(0);

  useEffect(() => {
    const userId = localStorage.getItem("userid");
    axios
      .post(
        "http://localhost:8080/expense-tracker/transactions/get.php",
        new URLSearchParams({ id: userId }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      )
      .then((response) => {
        setTransactions(response.data);
        calculateBudget(response.data);
      });
  }, []);
  const [filters, setFilters] = useState({
    min: "",
    max: "",
    type: "all",
    date: "",
    notes: "",
  });
  const [formState, setFormState] = useState({
    type: "income",
    amount: "",
    date: "",
    notes: "",
  });

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters({ ...filters, [id]: value });
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormState({ ...formState, [id]: value });
  };
  const handleAddTransaction = () => {
    const newTransaction = {
      ...formState,
      amount: parseFloat(formState.amount),
    };
    setTransactions([...transactions, newTransaction]);
    updateBudget(newTransaction);
    setFormState({ type: "income", amount: "", date: "", notes: "" });
  };

  const updateBudget = (transaction) => {
    const updatedBudget =
      transaction.type === "income"
        ? budget + transaction.amount
        : budget - transaction.amount;
    setBudget(updatedBudget);
  };
  return (
    <div className="app">
      <h1 className="text-center padding">Transactions</h1>

      <div className="padding flex row wrap horizontal-center filters">
        <div className="padding">
          <label htmlFor="min">Minimum Amount:</label>
          <input
            type="number"
            id="min"
            value={filters.min}
            onChange={handleFilterChange}
          />
        </div>
        <div className="padding">
          <label htmlFor="max">Maximum Amount:</label>
          <input
            type="number"
            id="max"
            value={filters.max}
            onChange={handleFilterChange}
          />
        </div>
        <div className="padding">
          <label htmlFor="type">Type:</label>
          <select id="type" value={filters.type} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="padding">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </div>
        <div className="padding">
          <label htmlFor="notes">Notes:</label>
          <input
            type="text"
            id="notes"
            value={filters.notes}
            onChange={handleFilterChange}
          />
        </div>
        <button className="filter-button bg-green">Filter</button>
      </div>

      <table className="transaction-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Note</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.type}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.date}</td>
              <td>{transaction.notes}</td>
              <td>
                <button className="action-button bg-green">Edit</button>
                <button className="action-button bg-green">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form className="flex column horizontal-center transaction-form">
        <label htmlFor="type">Type:</label>
        <select id="type" value={formState.type} onChange={handleFormChange}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={formState.amount}
          onChange={handleFormChange}
        />
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={formState.date}
          onChange={handleFormChange}
        />
        <label htmlFor="notes">Notes:</label>
        <input
          type="text"
          id="notes"
          value={formState.notes}
          onChange={handleFormChange}
        />
        <div className="flex horizontal-center padding">
          <button
            type="button"
            className="action-button bg-green"
            onClick={handleAddTransaction}
          >
            Add
          </button>
        </div>
      </form>

      <p className="budget text-green" id="budget">
        Budget: {budget}
      </p>
    </div>
  );
}

export default App;
