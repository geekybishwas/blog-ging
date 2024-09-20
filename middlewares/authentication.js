function checkForAuthenticationCokkie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    if (!tokenCookieValue) return next();

    try {
      const userPayload = validate_token(tokenCookieValue);
      req.user = userPayload;
    } catch (error) {}

    return next();
  };
}

module.exports = {
  checkForAuthenticationCokkie,
};
