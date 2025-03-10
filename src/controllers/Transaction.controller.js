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
      return res.status(404).json({
        message:
          "Nenhuma transação recorrente encontrada para o usuário fornecido",
      });
    }

    const data = recurringTransactions.map((transaction) => ({
      id: transaction._id,
      titulo: transaction.titulo,
      diaVencimento: transaction.diaVencimento,
      status: transaction.status,
      descricao: transaction.descricao,
      categoria: transaction.categoria,
      valor: transaction.valor,
      recurrence: transaction.recurrence,
      createdAt: transaction.createdAt,
    }));

    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
}

exports.registerRecurringTransaction = async (req, res) => {
  try {
    const { userID, titulo, diaVencimento, valor, tipo, categoria } = req.body;
    if (!userID || !valor || !tipo || !diaVencimento || !titulo || !categoria) {
      return res.status(400).json({ error: "Dados insuficientes" });
    }

    // Verifica se já existe uma transação recorrente com o mesmo título para o usuário
    const existingTransaction = await Transaction.findOne({
      userID,
      titulo,
      tipo: "recorrente",
    });

    if (existingTransaction) {
      return res
        .status(400)
        .json({ error: "Transação recorrente com este título já existe" });
    }

    const newTransaction = new Transaction({
      userID: userID,
      titulo: titulo,
      diaVencimento: diaVencimento,
      valor: valor,
      tipo: tipo,
      categoria: categoria,
    });

    await newTransaction.save();
    return res.status(201).json({
      message: "Transação recorrente registrada com sucesso",
      newTransaction,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { userID } = req.params;

    if (!userID ) {
      return res.status(400).json({ error: "Dados insuficientes" });
    }

    const transactions = await Transaction.find({ userID });

    if (!transactions.length) {
      return res.status(404).json({
        message: "Nenhuma transação encontrada para o mês e usuário fornecidos",
      });
    }

    const data = transactions.map((transaction) => ({
      id: transaction._id,
      titulo: transaction.titulo,
      date: transaction.date,
      status: transaction.status,
      descricao: transaction.descricao,
      valor: transaction.valor,
      createdAt: transaction.createdAt,
    }));
    console.log(data);
    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
};
;

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
    return res.status(200).json({
      message: "Relatório financeiro gerado com sucesso",
      dados: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
};

exports.getFinancialReportByUser = async (req, res) => {
  try {
    const { userID } = req.params;

    if (!userID) {
      return res.status(400).json({ error: "Dados insuficientes" });
    }

    const transactions = await Transaction.find({ userID });

    if (!transactions.length) {
      return res.status(404).json({
        message: "Nenhuma transação encontrada para o usuário fornecido",
      });
    }

    const totalRecebido = transactions
      .filter((transaction) => transaction.tipo === "recebido")
      .reduce((acc, transaction) => acc + transaction.valor, 0);

    const totalPago = transactions
      .filter((transaction) => transaction.tipo === "pago")
      .reduce((acc, transaction) => acc + transaction.valor, 0);

    const saldo = totalRecebido - totalPago;

    const data = transactions.map((transaction) => ({
      id: transaction._id,
      titulo: transaction.titulo,
      date: transaction.date,
      status: transaction.status,
      descricao: transaction.descricao,
      valor: transaction.valor,
      tipo: transaction.tipo,
      createdAt: transaction.createdAt,
    }));
    console.log(data)
    return res.status(200).json({
      message: "Relatório financeiro gerado com sucesso",
      saldo,
      totalRecebido,
      totalPago,
      transacoes: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
};

exports.registerNewInstallments = async (req, res) => {
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
    if (
      !userID ||
      !mesRef ||
      !valor ||
      !tipo ||
      !date ||
      !titulo ||
      !descricao ||
      !parcelas
    ) {
      return res.status(400).json({ error: "Dados insuficientes" });
    }

    const valorParcela = valor / parcelas;

    const newTransaction = new Transaction({
      userID: userID,
      titulo: titulo,
      descricao: descricao,
      status: status,
      formaPagamento: formaPagament,
      parcelas: parcelas,
      mesRef: mesRef,
      valor: valor,
      valorParcela: valorParcela,
      tipo: tipo,
      date: date,
    });

    await newTransaction.save();
    return res.status(201).json({ message: "Transação registrada com sucesso", newTransaction });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
}
exports.getInstallmentsByUser = async (req, res) => {
  try {
    const { userID } = req.params;

    if (!userID) {
      return res.status(400).json({ error: "Dados insuficientes" });
    }

    const installments = await Transaction.find({
      userID,
      parcelas: { $gt: 1 },
    });

    if (!installments.length) {
      return res.status(404).json({
        message: "Nenhuma parcela encontrada para o usuário fornecido",
      });
    }

    const data = installments.map((transaction) => ({
      id: transaction._id,
      titulo: transaction.titulo,
      parcelas: transaction.parcelas,
      valorParcela: transaction.valorParcela,
      status: transaction.status,
      descricao: transaction.descricao,
      formaPagamento: transaction.formaPagamento,
      mesRef: transaction.mesRef,
      valor: transaction.valor,
      tipo: transaction.tipo,
      date: transaction.date,
      createdAt: transaction.createdAt,
    }));

    return res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
};
