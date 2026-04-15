import ApiErrors from '../../common/utils/api-errors.js'
import { verifyAccessToken } from '../../common/utils/jwt.utils.js';
import { pool } from '../../common/config/db.js';
// import User from './auth.model.js'

const authenticate= async(req,res,next)=>{
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
        throw ApiErrors.unauthorized("Not Authenticated")
    }

    try {
        const decoded = verifyAccessToken(token)
        const result = await pool.query('SELECT * FROM myapp.users WHERE id = $1',[decoded.id])
        if (result.rowCount === 0) throw ApiErrors.unauthorized("User No Longer Exists")

        const user = result.rows[0];    
        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    } catch (error) {
        throw ApiErrors.unauthorized(error.message || "Invalid Token")
    }
    next()
}

const authorize =(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user?.role)){
            throw ApiErrors.unauthorized("You don't have the permission to Access it.")
        }
        next()
    }
}

export {authenticate,authorize}