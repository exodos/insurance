import { subDays } from "date-fns";
const dev = process.env.NODE_ENV != "production";

export const baseUrl = `http://localhost:3000`;

// export const baseUrl = dev ? "http://localhost:3000" : "http://192.168.43.30";

export const changePhone = (phone: string) => {
  let validPhone = "";

  if (phone.startsWith("0")) {
    validPhone = "251" + phone.slice(1);
  } else if (phone.startsWith("9")) {
    validPhone = "251" + phone;
  } else if (phone.startsWith("+")) {
    validPhone = phone.slice(1);
  } else {
    validPhone = phone;
  }

  return validPhone;
};

export const checkPolicy = (policyExpireDate: string | number | Date) => {
  const pexpireDate = new Date(policyExpireDate);
  const currentDate = new Date();

  return pexpireDate.valueOf() <= currentDate.valueOf() ? true : false;
};
