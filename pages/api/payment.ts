import type { NextApiRequest, NextApiResponse } from "next";
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
import { prisma } from "../../lib/prisma";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const xmlRequest = req.body;
  let xmlResponse: any;
  const options = {
    parseTagValue: true,
  };

  const parser = new XMLParser(options);
  let jsonObj = parser.parse(xmlRequest);
  let c2b = jsonObj["soapenv:Envelope"];
  let soapAction = Object.keys(c2b)[0];

  try {
    if (soapAction === "c2b:C2BPaymentQueryRequest") {
      const jsonValue =
        jsonObj["soapenv:Envelope"]["c2b:C2BPaymentQueryRequest"];
      // const RefNumber = jsonValue.RefNumber;
      const TransID = jsonValue.TransID;
      const BillRefNumber = jsonValue.BillRefNumber;

      const result = await prisma.payment.findFirst({
        where: {
          refNumber: BillRefNumber,
          paymentStatus: "PendingPayment",
        },
        include: {
          insureds: true,
        },
      });

      if (result) {
        xmlResponse = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:c2b="http://cps.huawei.com/cpsinterface/c2bpayment">
     <soapenv:Header/>
     <soapenv:Body>
        <c2b:C2BPaymentQueryResult> 
         <ResultCode>0</ResultCode> 
         <ResultDesc>Success</ResultDesc> 
         <TransID>${TransID}</TransID> 
         <BillRefNumber>${BillRefNumber}</BillRefNumber> 
         <UtilityName>thirdpartyinsurance</UtilityName> 
         <CustomerName>${result.insureds.firstName}</CustomerName> 
         <Amount>${result.premiumTarif}</Amount>
         <BranchCode>${result.branchCode}</BranchCode>
       </c2b:C2BPaymentQueryResult> 
    </soapenv:Body>
    </soapenv:Envelope>`;
      } else {
        xmlResponse = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:c2b="http://cps.huawei.com/cpsinterface/c2bpayment">
       <soapenv:Header/>
       <soapenv:Body>
          <c2b:C2BPaymentQueryResult> 
           <ResultCode>1</ResultCode> 
           <ResultDesc>Fail</ResultDesc> 
           <TransID>${TransID}</TransID> 
           <BillRefNumber>${BillRefNumber}</BillRefNumber> 
           <UtilityName>thirdpartyinsurance</UtilityName> 
         </c2b:C2BPaymentQueryResult> 
      </soapenv:Body>
      </soapenv:Envelope>`;
      }
    } else if (soapAction === "c2b:C2BPaymentConfirmationRequest") {
      const jsonValue =
        jsonObj["soapenv:Envelope"]["c2b:C2BPaymentConfirmationRequest"];
      const TransID = jsonValue.TransID;
      const BillRefNumber = jsonValue.BillRefNumber;

      const result = await prisma.payment.findFirst({
        where: {
          refNumber: BillRefNumber,
        },
        include: {
          insureds: true,
          certificates: true,
        },
      });

      if (result) {
        const response = await prisma.$transaction(async (tx) => {
          const paymentData = await tx.payment.update({
            where: { refNumber: BillRefNumber },
            data: {
              paymentStatus: "Paid",
            },
          });

          const certData = await tx.certificate.updateMany({
            where: {
              certificateNumber: {
                in: result.certificates.map((c) => c.certificateNumber),
              },
            },
            data: {
              status: "APPROVED",
            },
          });
          const vehicleData = await tx.vehicle.updateMany({
            where: {
              certificates: {
                certificateNumber: {
                  in: result.certificates.map((c) => c.certificateNumber),
                },
              },
            },
            data: {
              isInsured: "INSURED",
            },
          });

          return vehicleData;
        });

        if (response) {
          xmlResponse = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:c2b="http://cps.huawei.com/cpsinterface/c2bpayment"> 
        <soapenv:Header/> 
        <soapenv:Body>
        <c2b:C2BPaymentConfirmationResult>0</c2b:C2BPaymentConfirmationResult> 
        </soapenv:Body> 
        </soapenv:Envelope> `;

          // res.status(200).send(xmlResponse);
        } else {
          xmlResponse = `
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:c2b="http://cps.huawei.com/cpsinterface/c2bpayment"> 
        <soapenv:Header/> 
        <soapenv:Body>
        <c2b:C2BPaymentConfirmationResult>1</c2b:C2BPaymentConfirmationResult> 
        </soapenv:Body> 
        </soapenv:Envelope> `;

          // res.status(200).send(xmlResponse);
        }
      }
    }
    res.status(200).send(xmlResponse);
  } catch (err) {
    res.status(500).end(err);
  }
};

export default handler;
