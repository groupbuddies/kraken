module.exports = {
  fromArguments: function(email, firstName, lastName) {
    return {
      email: email,
      firstName: firstName,
      lastName: lastName
    };
  },
  withPassword: function(user) {
    user.password = user.firstName + 'password'
    return user;
  }
};
