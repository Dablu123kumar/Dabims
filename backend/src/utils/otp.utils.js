/**
 * Generate a 6-digit OTP
 */
export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(otp);
  return otp;
};



/**
 * Get OTP expiration time (5 minutes from now)
 */
export const getOTPExpirationTime = () => {
  return new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
};

/**
 * Check if OTP is still valid
 */
export const isOTPExpired = (expiresAt) => {
  return new Date() > new Date(expiresAt);
};
