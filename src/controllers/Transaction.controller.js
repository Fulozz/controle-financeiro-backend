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
        tipo: tipo,
        date: new Date().toISOString().slice(0, 10)
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
  
      // Calcula o total de recebimentos
      const totalRecebido = await Transaction.aggregate([
        { $match: { userID, tipo: 'recebido' } },
        {
          $group: {
            _id: null,
            totalRecebido: { $sum: '$valor' }
          }
        }
      ]);
  
      // Calcula o total de pagamentos
      const totalPago = await Transaction.aggregate([
        { $match: { userID, tipo: 'pago' } },
        {
          $group: {
            _id: null,
            totalPago: { $sum: '$valor' }
          }
        }
      ]);
  
      // Calcula o saldo
      const saldo = (totalRecebido[0]?.totalRecebido || 0) - (totalPago[0]?.totalPago || 0);
  
      // Obtém as transações do mês específico
      const monthlyTransactions = await Transaction.aggregate([
        { $match: { userID, mesRef } },
        {
          $group: {
            _id: null,
            totalRecebidoMes: { $sum: { $cond: [{ $eq: ['$tipo', 'recebido'] }, '$valor', 0] } },
            totalPagoMes: { $sum: { $cond: [{ $eq: ['$tipo', 'pago'] }, '$valor', 0] } }
          }
        }
      ]);
  
      const result = {
        saldo,
        mesReferencia: mesRef,
        totalRecebido: monthlyTransactions[0]?.totalRecebidoMes || 0,
        totalPago: monthlyTransactions[0]?.totalPagoMes || 0,
      };
  
      console.log(result, totalRecebido, totalPago, monthlyTransactions);
      return res.status(200).json({
        message: 'Relatório financeiro gerado com sucesso',
        dados: result
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error });
    }
  };