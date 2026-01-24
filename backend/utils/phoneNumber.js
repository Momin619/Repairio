export const normalizePhone = (phone) => phone?.replace(/\s|-/g, "");

export const validatePakMobile = (phone) => {
  const normalized = normalizePhone(phone);
  return /^03\d{9}$/.test(normalized);
};

export const toWhatsAppNumber = (phone) => {
  const normalized = normalizePhone(phone);

  if (!validatePakMobile(normalized)) {
    throw new Error("Invalid Pakistani mobile number");
  }

  return "92" + normalized.slice(1); // 03XXXXXXXXX → 92XXXXXXXXXX
};
