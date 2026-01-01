import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  // Initial Mock Data
  const initialStudents = [
    { id: 1, name: 'Rahim Uddin', class: '10', batch: 'Morning', phone: '01700000000', feesPaid: true },
    { id: 2, name: 'Karim Ahmed', class: '12', batch: 'Evening', phone: '01800000000', feesPaid: false },
    { id: 3, name: 'Sumaiya Akter', class: '10', batch: 'Morning', phone: '01900000000', feesPaid: true },
  ];

  const initialFees = [
    { id: 1, studentId: 1, amount: 1500, date: '2023-10-01', month: 'October' },
    { id: 2, studentId: 3, amount: 1500, date: '2023-10-02', month: 'October' },
  ];

  const initialExpenses = [
    { id: 1, description: 'Marker & Duster', amount: 500, date: '2023-10-05', category: 'Supplies' },
    { id: 2, description: 'Electricity Bill', amount: 2000, date: '2023-10-10', category: 'Utilities' },
  ];

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : initialStudents;
  });

  const [fees, setFees] = useState(() => {
    const saved = localStorage.getItem('fees');
    return saved ? JSON.parse(saved) : initialFees;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('fees', JSON.stringify(fees));
  }, [fees]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addStudent = (student) => {
    setStudents([...students, { ...student, id: Date.now() }]);
  };

  const addFee = (fee) => {
    setFees([...fees, { ...fee, id: Date.now() }]);
  };

  const addExpense = (expense) => {
    setExpenses([...expenses, { ...expense, id: Date.now() }]);
  };

  return (
    <DataContext.Provider value={{ students, fees, expenses, addStudent, addFee, addExpense }}>
      {children}
    </DataContext.Provider>
  );
};
