export const request = {
  validData: {
    currentPassword: "OldPassword123!",
    newPassword: "NewSecurePassword456!",
    confirmNewPassword: "NewSecurePassword456!",
  },
  wrongCurrentPassword: {
    currentPassword: "WrongPassword123!",
    newPassword: "NewSecurePassword456!",
    confirmNewPassword: "NewSecurePassword456!",
  },
  passwordsMismatch: {
    currentPassword: "OldPassword123!",
    newPassword: "NewSecurePassword456!",
    confirmNewPassword: "DifferentPassword789!",
  },
  weakPassword: {
    currentPassword: "OldPassword123!",
    newPassword: "weak",
    confirmNewPassword: "weak",
  },
  noUppercase: {
    currentPassword: "OldPassword123!",
    newPassword: "newsecurepassword456!",
    confirmNewPassword: "newsecurepassword456!",
  },
  noLowercase: {
    currentPassword: "OldPassword123!",
    newPassword: "NEWSECUREPASSWORD456!",
    confirmNewPassword: "NEWSECUREPASSWORD456!",
  },
  noNumber: {
    currentPassword: "OldPassword123!",
    newPassword: "NewSecurePassword!",
    confirmNewPassword: "NewSecurePassword!",
  },
  noSymbol: {
    currentPassword: "OldPassword123!",
    newPassword: "NewSecurePassword456",
    confirmNewPassword: "NewSecurePassword456",
  },
  sameAsOld: {
    currentPassword: "OldPassword123!",
    newPassword: "OldPassword123!",
    confirmNewPassword: "OldPassword123!",
  },
  missingCurrentPassword: {
    newPassword: "NewSecurePassword456!",
    confirmNewPassword: "NewSecurePassword456!",
  },
  missingNewPassword: {
    currentPassword: "OldPassword123!",
    confirmNewPassword: "NewSecurePassword456!",
  },
  missingConfirmPassword: {
    currentPassword: "OldPassword123!",
    newPassword: "NewSecurePassword456!",
  },
};
