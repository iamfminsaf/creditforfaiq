const Customer = require("../models/customerModel");

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const findBalance = (trans) => {
  var balance = 0;
  trans.map((trans) => {
    balance += trans.amount;
  });
  return balance;
};

const findTotalBalance = (cuslist) => {
  var totalBalance = 0;
  cuslist.map((cus) => {
    totalBalance += cus.balance;
  });
  return totalBalance;
};

const anologice = (hour) => {
  if (hour > 12) {
    return hour - 12;
  }
  return hour;
};

const amPm = (hour) => {
  if (hour >= 12) {
    return "PM";
  }
  return "AM";
};

const getCustomers = async (req, res) => {
  try {
    const { uid } = req.user;
    const customers = await Customer.find({ uid });

    const cusList = customers.map((customer) => {
      const balance = findBalance(customer.transaction);
      return {
        cusname: customer.cusname,
        profile: customer.profile,
        cusID: customer._id,
        star: customer.star,
        balance,
      };
    });

    const totalBalance = findTotalBalance(cusList);

    return res.status(200).json({ cusList, totalBalance });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "something wrong" });
  }
};

const getCustomer = async (req, res) => {
  try {
    const cusID = req.params.id;
    const customer = await Customer.findById(cusID);

    if (!customer) {
      return res.status(404).json({ msg: "customer not found" });
    }

    if (customer.uid.toString() !== req.user.uid.toString()) {
      return res.status(401).json({ access: false });
    }

    const balance = findBalance(customer.transaction);

    return res.status(200).json({ ...customer._doc, balance });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "something wrong" });
  }
};

const addCustomer = async (req, res) => {
  try {
    const { cusname } = req.body;
    const { uid } = req.user;
    var newCustomerData = {};
    if (!cusname) {
      if (req.file) {
        res.status(200).json({ msg: "profile recived but not cusname" });
      }
      return res.status(400).json({ msg: "cusname must be provided" });
    }

    if (!req.file) {
      newCustomerData = {
        cusname,
        uid,
        star: false,
      };
    } else {
      newCustomerData = {
        cusname,
        uid,
        profile: req.file.filename,
        star: false,
      };
    }

    const newCustomer = await Customer.create(newCustomerData);

    return res
      .status(201)
      .json({ cusID: newCustomer._id, msg: "customer created" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "something wrong" });
  }
};

const addTransaction = async (req, res) => {
  try {
    const { desc, amount } = req.body;

    if (!desc || !amount || isNaN(amount)) {
      return res.status(400).json({
        msg: "desc and amount are must be provided and amount must be a number",
      });
    }

    const cusID = req.params.id;

    const customer = await Customer.findById(cusID);

    if (!customer) {
      return res.status(404).json({ msg: "could not find customer" });
    }

    if (customer.uid.toString() !== req.user.uid.toString()) {
      return res.status(400).json({ access: false });
    }

    const now = new Date();
    const date = now.getDate().toString().padStart(2, "0");
    const month = months[now.getMonth()];
    const mint = now.getMinutes().toString().padStart(2, "0");
    const hour = anologice(now.getHours()).toString().padStart(2, "0");
    const ampm = amPm(now.getHours());

    const newTransaction = {
      desc,
      amount,
      date: `${date}/${month}`,
      time: `${hour}:${mint} ${ampm}`,
    };

    customer.transaction.push(newTransaction);
    await customer.save();

    return res.status(201).json({ msg: "transaction saved" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "something wrong" });
  }
};

const updateNote = async (req, res) => {
  try {
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({ msg: "note must be provided" });
    }

    const cusID = req.params.id;

    const customer = await Customer.findById(cusID);

    if (!customer) {
      return res.status(404).json({ msg: "customer not found" });
    }

    if (customer.uid.toString() !== req.user.uid.toString()) {
      return res.status(401).json({ access: false });
    }

    customer.note = note;
    await customer.save();

    return res.status(202).json({ msg: "note updated" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "something went wrong" });
  }
};

const updateProfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "profile photo must be attached" });
    }

    const cusID = req.params.id;

    const customer = await Customer.findById(cusID);

    if (!customer) {
      return res.status(404).json({ msg: "customer not found" });
    }

    if (customer.uid.toString() !== req.user.uid.toString()) {
      return res.status(401).json({ access: false });
    }

    customer.profile = req.file.filename;
    await customer.save();

    return res.status(202).json({ msg: "profile updated" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "something went wrong" });
  }
};

const starCustomer = async (req, res) => {
  try {
    const cusID = req.params.id;

    const customer = await Customer.findById(cusID);

    if (!customer) {
      return res.status(404).json({ msg: "customer not found" });
    }

    if (customer.uid.toString() !== req.user.uid.toString()) {
      return res.status(401).json({ msg: "you can't star this customer" });
    }

    customer.star = !customer.star;
    await customer.save();

    return res.status(202).json({ star: customer.star });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "something wrong" });
  }
};

module.exports = {
  getCustomers,
  getCustomer,
  addCustomer,
  addTransaction,
  updateNote,
  starCustomer,
  updateProfile,
};
