import jwt from "jsonwebtoken";

const authenticateToken = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({ success: false, message: "You are not logged in." });
  }

  try {
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = verifiedToken.id || verifiedToken._id;
    next();
  } catch (error) {
    console.log("Error in authentication middleware");
    console.log(error);
    res.json({ success: false, message: "Something went wrong" });
  }
};

export default authenticateToken;
