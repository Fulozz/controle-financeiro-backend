const Transaction = require("../models/Transaction.model");

exports.registerNewTransaction = async (req, res) => {
  try {
    const {
      userID,
      titulo,
      parcelas,
      descricao,
      formaPagament,
      date,
      mesRef,
      valor,
      tipo,
      status,
    } = req.body;
    console.log(req.body);
    if (
      !userID ||
      !mesRef ||
      !valor ||
      !tipo ||
      !date ||
      !titulo ||
      !descricao
    ) {
      return res.status(400).json({ error: "Dados insuficientes" });
    }
    const newTransaction = new Transaction({
      userID: userID,
      titulo: titulo,
      descricao: descricao,
      status: status,
      formaPagamento: formaPagament,
      parcelas: parcelas,
      mesRef: mesRef,
      valor: valor,
      tipo: tipo,
      date: date,
    });

    await newTransaction.save();
    return res
      .status(201)
      .json({ message: "Transação registrada com sucesso", newTransaction });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};
exports.registerRecurringTransaction = async (req, res) => {
  try {
    const {
      userID,
      titulo,
      diaVencimento,
      valor,
      tipo,
      categoria
       } = req.body;
    console.log(req.body);
    if (
      !userID ||
      !valor ||
      !tipo ||
      !diaVencimento||
      !titulo || 
      !categoria
    ) {
      return res.status(400).json({ error: "Dados insuficientes" });
    }

    const newTransaction = new Transaction({
      userID: userID,
      titulo: titulo,
      diaVencimento: diaVencimento,
      valor: valor,
      tipo: tipo,
      categoria: categoria
    });

    await newTransaction.save();
    return res
      .status(201)
      .json({
        message: "Transação recorrente registrada com sucesso",
        newTransaction,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};


exports.getTransactionsByMonth = async (req, res) => {
  try {
    const { userID, mesRef } = req.params;

    if (!userID || !mesRef) {
      return res.status(400).json({ error: "Dados insuficientes" });
    }

    const transactions = await Transaction.find({ userID, mesRef });

    if (!transactions.length) {
      return res
        .status(404)
        .json({
          message:
            "Nenhuma transação encontrada para o mês e usuário fornecidos",
        });
    }

    const data = transactions.map((transaction) => ({
      id: transaction._id,
      titulo: transaction.titulo,
      date: transaction.date,
      status: transaction.status,
      descricao: transaction.descricao,
      valor: transaction.valor,
      createdAt: transaction.createdAt
    }));
    console.log(data);
    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
};
exports.getRecurringTransactionsByUser = async (req, res) => {
  try {
    const { userID } = req.params;

    if (!userID) {
      return res.status(400).json({ error: "Dados insuficientes" });
    }

    const recurringTransactions = await Transaction.find({
      userID,
      tipo: "recorrente",
    });

    if (!recurringTransactions.length) {
      return res
        .status(404)
        .json({
          message:
            "Nenhuma transação recorrente encontrada para o usuário fornecido",
        });
    }

    const data = recurringTransactions.map((transaction) => ({
      id: transaction._id,
      titulo: transaction.titulo,
      date: transaction.date,
      status: transaction.status,
      descricao: transaction.descricao,
      valor: transaction.valor,
      recurrence: transaction.recurrence,
      createdAt: transaction.createdAt
    }));

    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
};

exports.getFinancialReport = async (req, res) => {
  try {
    const { userID, mesRef } = req.params;

    if (!userID || !mesRef) {
      return res.status(400).json({ error: "Dados insuficientes" });
    }

    // Calcula o total de recebimentos
    const totalRecebido = await Transaction.aggregate([
      { $match: { userID, tipo: "recebido" } },
      {
        $group: {
          _id: null,
          totalRecebido: { $sum: "$valor" },
        },
      },
    ]);

    // Calcula o total de pagamentos
    const totalPago = await Transaction.aggregate([
      { $match: { userID, tipo: "pago" } },
      {
        $group: {
          _id: null,
          totalPago: { $sum: "$valor" },
        },
      },
    ]);

    // Calcula o saldo
    const saldo =
      (totalRecebido[0]?.totalRecebido || 0) - (totalPago[0]?.totalPago || 0);

    // Obtém as transações do mês específico
    const monthlyTransactions = await Transaction.aggregate([
      { $match: { userID, mesRef } },
      {
        $group: {
          _id: null,
          totalRecebidoMes: {
            $sum: { $cond: [{ $eq: ["$tipo", "recebido"] }, "$valor", 0] },
          },
          totalPagoMes: {
            $sum: { $cond: [{ $eq: ["$tipo", "pago"] }, "$valor", 0] },
          },
        },
      },
    ]);

    const result = {
      saldo,
      mesReferencia: mesRef,
      totalRecebido: monthlyTransactions[0]?.totalRecebidoMes || 0,
      totalPago: monthlyTransactions[0]?.totalPagoMes || 0,
    };

    console.log(result, totalRecebido, totalPago, monthlyTransactions);
    return res.status(200).json({
      message: "Relatório financeiro gerado com sucesso",
      dados: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
};
