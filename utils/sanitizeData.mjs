export const sanitizeUser = function (user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
};

export const sanitizeUserProfile = function (user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  };
};
