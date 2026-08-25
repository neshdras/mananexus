const db = require('../config/database')

exports.seeAll = async (req, res)=>{
    try {
        
    } catch (err) {
        res.status(500).json({message: err.message})
    }
    const text = 'SELECT * FROM tournaments'
    const result = await db.query(text) 
    console.log(result)
    res.json(result.rows[0])
}