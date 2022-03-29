function validate(req, res, next) {
  const { userName, firstName, lastName, age, password, repeatPassword } =
    req.body;
  const errors = {};
  if (
    !(userName && firstName && lastName && age && password && repeatPassword)
  ) {
    errors.message = "All fields are required";
  }
  if (password !== repeatPassword) {
    errors.repeatPassword = "Passwords must match";
  }
  if (userName.length < 3) {
    errors.userName = "Username must be at least 3 characters";
  }
  if (password.length < 4) {
    errors.password = "Password must be at least 4 characters";
  }
  if (password.search(/[0-9]/) < 0) {
    errors.password = "Password must contain a number";
  }
  if (password.search(/[a-zA-Z]/) < 0) {
    errors.password = "Password must contain a letter";
  }
  if (firstName.length < 3) {
    errors.firstName = "First name must be at least 3 characters";
  }
  if (lastName.length < 3) {
    errors.lastName = "Last name must be at least 3 characters";
  }
  if (age < 1) {
    errors.age = "Age must be at least 1";
  }
  if (Object.keys(errors).length > 0) {
    res.status(400).json(errors);
  } else {
    next();
  }
}

module.exports = validate;
