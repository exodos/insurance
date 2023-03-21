import type { NextApiRequest, NextApiResponse } from "next";
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
import { prisma } from "../../lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const xmlRequest = req.body;
  const options = {
    parseTagValue: true,
  };

  const parser = new XMLParser(options);
  let jsonObj = parser.parse(xmlRequest);
  let c2b = jsonObj["soapenv:Envelope"];
  let jsonValue = jsonObj["soapenv:Envelope"]["c2b:C2BPaymentQueryRequest"];
  const RefNumber = jsonValue.RefNumber;
  let soapAction = Object.keys(c2b)[0];

  if (soapAction === "c2b:C2BPaymentQueryRequest") {
    res.status(200).send(`Yes Its: ${RefNumber}`);
  } else {
    res.status(200).send("No its not");
  }

  // let c2bValue = jsonObj["soapenv:Envelope"]["c2b:C2BPaymentQueryRequest"];
  // const RefNumber = c2bValue.RefNumber;
  // res.status(200).send(RefNumber);

  //   const result = await prisma.payment.findFirst({
  //     where: {
  //       refNumber: RefNumber,
  //       paymentStatus: "PendingPayment",
  //     },
  //     include: {
  //       insureds: true,
  //       certificates: true,
  //     },
  //   });

  //   if (result) {
  //     const xmlResult = `
  //   <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:c2b="http://cps.huawei.com/cpsinterface/c2bpayment">
  //    <soapenv:Header/>
  //    <soapenv:Body>
  //       <c2b:C2BPaymentValidationResult>
  //       <CustomerName>${result.insureds.firstName}</CustomerName>
  //       <PremiumTarif>${result.premiumTarif}</PremiumTarif>
  //       </c2b:C2BPaymentValidationResult>
  //    </soapenv:Body>
  // </soapenv:Envelope>
  // `;

  //     res.status(200).send(xmlResult);
  //   } else {
  //     res.status(200).json({ message: "No Found" });
  //   }
};

export default handler;
