const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');


exports.getTransactions = async (req, res) => {
  const { 
    page = 1, 
    limit = 5, 
    type, 
    sort = 'date', 
    order = 'desc', 
    startDate, 
    endDate, 
    minAmount, 
    maxAmount,
    category 
  } = req.query;

  try {
    const query = { user: req.user.id };

    if (type && ['income', 'expense'].includes(type.toLowerCase())) {
      query.type = type.toLowerCase();
    }
    if (category) query.category = category;

 
    if (startDate || endDate) {
      query.date = {};
      
      if (startDate) {
        const start = new Date(startDate);
        start.setUTCHours(0, 0, 0, 0); // Start of the day
        query.date.$gte = start;
      }
      
      if (endDate) {
        const end = new Date(endDate);
        end.setUTCHours(23, 59, 59, 999); // End of the day
        query.date.$lte = end;
      } else if (startDate) {
        // If only one date is picked, show ONLY that 24-hour window
        const endOfDay = new Date(startDate);
        endOfDay.setUTCHours(23, 59, 59, 999);
        query.date.$lte = endOfDay;
      }
    }

    // Amount Range Filter
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    // Sorting & Pagination
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Parallel Execution for speed
    const [transactions, totalResults] = await Promise.all([
      Transaction.find(query)
        .sort(sortOptions)
        .limit(parseInt(limit))
        .skip(skip),
      Transaction.countDocuments(query)
    ]);

    res.json({ 
      success: true,
      transactions, 
      totalPages: Math.ceil(totalResults / limit),
      totalResults,
      currentPage: Number(page)
    });
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch transactions" });
  }
};

// 2. Get Financial Stats 
exports.getTransactionStats = async (req, res) => {
  try {
    const stats = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] }
          },
          totalExpense: {
            $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          income: "$totalIncome",
          expense: "$totalExpense",
          balance: { $subtract: ["$totalIncome", "$totalExpense"] }
        }
      }
    ]);

    const result = stats.length > 0 ? stats[0] : { income: 0, expense: 0, balance: 0 };
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: "Failed to calculate stats" });
  }
};

// 3. Add Transaction
exports.addTransaction = async (req, res) => {
  const { type, description, amount, date, category } = req.body;
  try {
    if (!type || !description || !amount || !category) {
      return res.status(400).json({ msg: "Please fill in all fields" });
    }

    const newTrans = new Transaction({ 
      user: req.user.id, 
      type: type.toLowerCase(), 
      description, 
      category,
      amount: Number(amount),
      date: date || new Date()
    });

    const savedTransaction = await newTrans.save();
    res.status(201).json(savedTransaction);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};