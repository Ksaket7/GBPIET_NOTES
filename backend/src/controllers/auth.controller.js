const registerUser = (req, res) => {
  res.json({ message: "Register endpoint working " });
};

const loginUser = (req, res) => {
  res.json({ message: "login endpoint working " });
};

export { registerUser, loginUser };
