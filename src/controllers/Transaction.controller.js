const Transaction = require('../models/Transaction.model')

exports.registerNewTransaction = async (req, res)=>{
    try {
        const userID = req.body.userID;
        const data = req.body.data;
        const mesRef = req.body.mesRef;
        const valor = req.body.valor;
        const tipo = req.body.tipo;
        
    if(!userID || !data || !mesRef || !valor || !tipo){
        return res.status(400).json({ error: 'Dados insuficientes'})
    }
    const newTransaction = new Transaction({
        userID: userID,
        data: data,
        mesRef: mesRef,
        valor: valor,
        tipo: tipo
    })

    await newTransaction.save()
    return res.status(201).json({ message: 'Transação registrada com sucesso', newTransaction})
    } catch (error) {
        return res.status(500).json({ error: error })
    }
}

exports.getFinancialReport = async (req, res) => {
    try {
        const userID = req.body.userID
        const mesRef = req.body.mesRef  
        if(!userID || !mesRef){
            return res.status(400).json({ error: 'Dados insuficientes'})
        }
        const transaction = await Transaction.aggregate([
            {
                $match: {
                    userID,
                    mesRef
                }
            },
            {
                $group: {
                    _id: '$tipo',
                    totalRecebido: { $sum: { $cond: [{ $eq: ['$tipo', 'recebido']}, '$valor', 0] } },
                    totalPago: { $sum: { $cond: [{ $eq: ['$tipo', 'pago']}, '$valor', 0] } }
                }
            }
        ]);
        const result = transaction[0] || { }

        return ({
            totalRecebido: result.totalRecebido || 0,
            totalPago: result.totalPago || 0,
            saldo: (result.totalRecebido || 0) - (result.totalPago || 0)
            
        }, res.status(200).json({ message: 'Relatório financeiro gerado com sucesso', result}))
    } catch (error) {
        res.status(500).json({ error: error })
    }
}