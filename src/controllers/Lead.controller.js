
const Email = require('../models/Lead.model');
const sendEmail = require('../utils/sendEmail');

exports.registerNewLead = async (req, res)=>{
    try {
        const newEmail = new Email({
            email: req.body.email,
            name: req.body.name,
            phone: req.body.phone,
            company: req.body.company,
            message: req.body.message
        });
        const email = await newEmail.save();
        await sendEmail({
          email: req.body.email,
          name: req.body.name,
          phone: req.body.phone,
          company: req.body.company,
          message: req.body.message
        })
        return res.status(200).json({ message: 'Email enviado com sucesso', email})
    } catch (error) {
        res.status(400).json({ error: error })
    }
};