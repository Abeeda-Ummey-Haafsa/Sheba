export const formatResponse = (data, message = "Success") => {
  return {
    success: true,
    message,
    data,
  };
};

export const formatError = (message, code = 500) => {
  return {
    success: false,
    message,
    code,
  };
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\d{10,15}$/;
  return phoneRegex.test(phone.replace(/\D/g, ""));
};
