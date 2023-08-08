import axios from "axios";
const dev = process.env.NODE_ENV != "production";

export const baseUrl = `https://insurancefund.gov.et`;

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
export const changePhoneNew = (phone: string) => {
  if (phone.startsWith("0")) {
    return phone.slice(1);
  } else if (phone.startsWith("9")) {
    return phone;
  } else if (phone.startsWith("+")) {
    return phone.slice(4);
  } else {
    return phone;
  }
};

export const phoneRegExp = /^(^\+251|^251|^0)?(9|7)\d{8}$/;

export const checkPolicy = (policyExpireDate: string | number | Date) => {
  const pexpireDate = new Date(policyExpireDate);
  const currentDate = new Date();

  return pexpireDate.valueOf() <= currentDate.valueOf() ? true : false;
};

export const sendSmsMessage = async (mobileNumber: string, message: string) => {
  let url = `${process.env.TEMP_SMS_URL}?receiver=${mobileNumber}&message=${message}`;

  let response = await axios.get(url);
  console.log(response.data);

  // return response.data;
};

export const sendMultiSmsMessage = async (smsMessage) => {
  smsMessage.map(async (sms) => {
    let url = `${process.env.TEMP_SMS_URL}?receiver=${sms.mobileNumber}&message=${sms.message}`;
    let response = await axios.get(url);
    console.log(response.data);
  });
};

export enum USERTYPE {
  USER = "USER",
  ADMIN = "ADMIN",
  INSURER = "INSURER",
  BRANCH = "BRANCH",
  TRAFFICPOLICE = "TRAFFICPOLICE",
}

export enum USERROLE {
  SUPERADMIN = "SUPERADMIN",
  INSURER = "INSURER",
  BRANCHADMIN = "BRANCHADMIN",
  MEMBER = "MEMBER",
  USER = "USER",
  TRAFFICPOLICEADMIN = "TRAFFICPOLICEADMIN",
  TRAFFICPOLICEMEMBER = "TRAFFICPOLICEMEMBER",
}
