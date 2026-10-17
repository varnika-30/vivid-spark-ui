import { loginUser, refreshAccessToken, getUserProfile } from '../services/auth.service.js';

/**
 * POST /api/auth/login
 * Authenticates user, sets HTTP-only Refresh Token cookie, and returns Access Token + User profile.
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const { user, accessToken, refreshToken } = await loginUser(email, password);

    // Store Refresh Token in secure HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/refresh
 * Verifies Refresh Token from HTTP-only cookie and issues a new Access Token.
 */
export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    const { accessToken } = await refreshAccessToken(refreshToken);

    return res.status(200).json({
      success: true,
      message: 'Access token refreshed successfully',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Clears the Refresh Token HTTP-only cookie.
 */
export const logout = async (req, res, next) => {
  try {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Retrieves current authenticated user profile. Protected by authMiddleware.
 */
export const getMe = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await getUserProfile(userId);

    return res.status(200).json({
      success: true,
      message: 'User profile fetched successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
