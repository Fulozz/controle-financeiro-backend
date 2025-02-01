
const Email = require('../models/Lead.model');
const sendEmail = require('../utils/sendEmail');

exports.registerNewLead = async (req, res)=>{
    try {
        const newLead = new Email({
            email: req.body.email,
            name: req.body.name,
            phone: req.body.phone,
            company: req.body.company,
            message: req.body.message
        });
        const lead = await newLead.save();
        await sendEmail({
          email: req.body.email,
          name: req.body.name,
          phone: req.body.phone,
          company: req.body.company,
          message: req.body.message
        })
        return res.status(201).json({ message: 'Email enviado com sucesso', lead})
    } catch (error) {
        res.status(400).json({ error: error })
    }
};