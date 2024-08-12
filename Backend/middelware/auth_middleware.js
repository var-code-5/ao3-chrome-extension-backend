import bcrypt from 'bcrypt';

const generateHash = async (password) => {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
};

//regex pattern matching
export const hashPassword = async (req, res, next) => {
    const password = req.body.password;
    const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,20}$/;
    if (!pattern.test(password)) {
      return res.status(400).json({
        success: false,
        message: {
          type: "Weak Password",
          content:
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.",
        },
      });
    }
    req.body.password = await generateHash(password);
    next();
};
