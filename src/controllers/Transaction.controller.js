const Transaction = require('../models/Transaction.model')

exports.registerNewTransaction = async (req, res)=>{
    try {
       const { userID,  mesRef, valor, tipo } = req.body
        console.log(req.body)
    if(!userID || !mesRef || !valor || !tipo){
        return res.status(400).json({ error: 'Dados insuficientes'})
    }
    const newTransaction = new Transaction({
        userID: userID,
        mesRef: mesRef,
        valor: valor,
        tipo: tipo
    })

    await newTransaction.save()
    return res.status(201).json({ message: 'Transação registrada com sucesso', newTransaction})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}

exports.getFinancialReport = async (req, res) => {
    try {
      const { userID, mesRef } = req.params;
  
      if (!userID || !mesRef) {
        return res.status(400).json({ error: 'Dados insuficientes' });
      }
  
      // Calcula o saldo total
      const totalBalance = await Transaction.aggregate([
        { $match: { userID } },
        {
          $group: {
            _id: null,
            totalRecebido: { $sum: { $cond: [{ $eq: ['$tipo', 'recebido'] }, '$valor', 0] } },
            totalPago: { $sum: { $cond: [{ $eq: ['$tipo', 'pago'] }, '$valor', 0] } }
          }
        }
      ]);
  
      // Obtém as transações do mês específico
      const monthlyTransactions = await Transaction.aggregate([
        { $match: { userID, mesRef } },
        {
          $group: {
            _id: null,
            totalRecebido: { $sum: { $cond: [{ $eq: ['$tipo', 'recebido'] }, '$valor', 0] } },
            totalPago: { $sum: { $cond: [{ $eq: ['$tipo', 'pago'] }, '$valor', 0] } }
          }
        }
      ]);
  
      const result = {
        saldo: totalBalance[0]?.totalBalance || 0,
        mesRef: mesRef,
        totalRecebido: monthlyTransactions[0]?.totalRecebido || 0,
        totalPago: monthlyTransactions[0]?.totalPago || 0,
      };
      console.log(result);
      return res.status(200).json({
        message: 'Relatório financeiro gerado com sucesso',
        dados: result
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }
  };