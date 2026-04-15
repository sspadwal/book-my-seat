import * as authService from './auth.service.js'
import ApiResponse from '../../common/utils/api-responses.js'

const register = async (req, res, next) => {
    try {
        const user = await authService.register(req.body);
        ApiResponse.created(res, "User Registered Successfully", user)
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    try {
        const { user, accessToken, refreshToken } = await authService.login(req.body);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000           // 15 min
        })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
        })
        ApiResponse.ok(res, "Login Successful", { user, accessToken })
    } catch (error) {
        next(error)
    }
}

const logout = async (req, res, next) => {
    try {
        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")
        ApiResponse.ok(res, "Logged out successfully")
    } catch (error) {
        next(error)
    }
}

const getMe = async (req, res, next) => {
    try {
        ApiResponse.ok(res, "User Profile", req.user)
    } catch (error) {
        next(error)
    }
}

const refresh = async (req, res, next) => {
    try {
        const { accessToken, refreshToken } = await authService.refresh(
            req.cookies.refreshToken || req.body.refreshToken
        );
        ApiResponse.ok(res, "Token refreshed", { accessToken, refreshToken })
    } catch (error) {
        next(error)
    }
}

const forgotPass = async (req, res, next) => {
    try {
        await authService.forgotPassword(req.body.email)
        ApiResponse.ok(res, "Reset email sent")
    } catch (error) {
        next(error)
    }
}

const resetPass = async (req, res, next) => {
    try {
        await authService.resetPassword(req.params.id, req.body.password)
        ApiResponse.ok(res, "Password reset successful")
    } catch (error) {
        next(error)
    }
}

const verifyUser = async (req, res, next) => {
    try {
        const user = await authService.verifyUser(req.params.id)
        ApiResponse.ok(res, "User Verified", user)
    } catch (error) {
        next(error)
    }
}

const greetHello = async (req, res, next) => {
    try {
        ApiResponse.ok(res, "Book My Ticket API is running 🎬")
    } catch (error) {
        next(error)
    }
}

export { register, login, logout, getMe, refresh, forgotPass, resetPass, verifyUser, greetHello }