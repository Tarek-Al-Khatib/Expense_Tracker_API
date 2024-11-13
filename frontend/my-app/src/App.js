import React, { useEffect, useState } from "react";
import "./App.css";
import "./base/base.css";
import "./base/colors.css";
import axios from "axios";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [formState, setFormState] = useState({
    type: "income",
    amount: "",
    date: "",
    notes: "",
    id: null,
  });
  const [filters, setFilters] = useState({
    type: "all",
    min: "",
    max: "",
    date: "",
    notes: "",
  });
  const [budget, setBudget] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userId = 7;
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

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormState({ ...formState, [id]: value });
  };

  const handleFilterChange = (e) => {
    const { id, value } = e.target;
    setFilters({ ...filters, [id]: value });
  };

  const applyFilters = () => {
    let filteredTransactions = transactions;
    if (filters.type !== "all") {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.type === filters.type
      );
    }
    if (filters.min) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.amount >= parseFloat(filters.min)
      );
    }
    if (filters.max) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.amount <= parseFloat(filters.max)
      );
    }
    if (filters.date) {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.date === filters.date
      );
    }
    if (filters.notes) {
      filteredTransactions = filteredTransactions.filter((t) =>
        t.notes.toLowerCase().includes(filters.notes.toLowerCase())
      );
    }
    calculateBudget(filteredTransactions);
  };

  const calculateBudget = (transactionsList) => {
    const income = transactionsList
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const expenses = transactionsList
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    setBudget(income - expenses);
  };

  const resetForm = () => {
    setFormState({ type: "income", amount: "", date: "", notes: "", id: null });
    setIsEditing(false);
  };

  return (
    <div className="app">
      <h1 className="text-center padding">Transactions</h1>

      <div className="padding flex row wrap horizontal-center filters">
        <div className="padding">
          <label htmlFor="min-filter">Minimum Amount:</label>
          <input
            type="number"
            id="min-filter"
            value={filters.min}
            onChange={handleFilterChange}
          />
        </div>
        <div className="padding">
          <label htmlFor="max-filter">Maximum Amount:</label>
          <input
            type="number"
            id="max-filter"
            value={filters.max}
            onChange={handleFilterChange}
          />
        </div>
        <div className="padding">
          <label htmlFor="type-filter">Type:</label>
          <select
            id="type-filter"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="padding">
          <label htmlFor="date-filter">Date:</label>
          <input
            type="date"
            id="date-filter"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </div>
        <div className="padding">
          <label htmlFor="notes-filter">Notes:</label>
          <input
            type="text"
            id="notes-filter"
            value={filters.notes}
            onChange={handleFilterChange}
          />
        </div>
        <button
          id="filter-button"
          className="filter-button bg-green"
          onClick={applyFilters}
        >
          Filter
        </button>
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
        <tbody id="transaction-table-body">
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              style={{
                backgroundColor:
                  transaction.type === "income" ? "#90EE90" : "#FF808C",
              }}
            >
              <td>{transaction.type.toUpperCase()}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.date}</td>
              <td>{transaction.notes}</td>
              <td>
                <button
                  className={`edit-button edit-delete ${
                    transaction.type === "income" ? "bg-red" : "bg-green"
                  }`}
                  onClick={() => {
                    setFormState(transaction);
                    setIsEditing(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className={`delete-button edit-delete ${
                    transaction.type === "income" ? "bg-red" : "bg-green"
                  }`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form
        id="transaction-form"
        className="flex column horizontal-center transaction-form"
      >
        <input type="hidden" id="transaction-id" value={formState.id || ""} />
        <label htmlFor="type">Type:</label>
        <select
          id="type"
          value={formState.type}
          onChange={handleFormChange}
          required
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={formState.amount}
          onChange={handleFormChange}
          required
        />
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={formState.date}
          onChange={handleFormChange}
          required
        />
        <label htmlFor="notes">Notes:</label>
        <input
          type="text"
          id="notes"
          value={formState.notes}
          onChange={handleFormChange}
          required
        />
        <div className="flex horizontal-center padding">
          <button
            id="add-form-button"
            className="action-button bg-green"
            type="submit"
          >
            {isEditing ? "Edit" : "Add"}
          </button>
          {isEditing && (
            <button
              id="cancel-button"
              className="action-button bg-green"
              type="button"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <p className="budget text-green" id="budget">
        Your Total Budget is: {budget}
      </p>
    </div>
  );
}

export default App;
