import {prisma} from "@/lib/prisma";
import { format } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const checkCert = await prisma.certificate.findMany({
      where: {
        policies: {
          policyExpireDate: {
            lte: new Date(),
          },
        },
      },
      include: {
        vehicles: {
          include: {
            insureds: true,
          },
        },
      },
    });

    if (checkCert) {
      checkCert.map(async (cId) => {
        await prisma.certificate.update({
          where: {
            id: cId.id,
          },
          data: {
            status: "PendingPayment",
            vehicles: {
              update: {
                isInsured: "NOTINSURED",
              },
            },
            payments: {
              create: {
                refNumber: `RN-${format(new Date(), "yyMMiHms")}`,
                paymentStatus: "PendingPayment",
                premiumTarif: cId.premiumTarif,
                insureds: {
                  connect: {
                    regNumber: cId.vehicles.insureds.regNumber,
                  },
                },
                branchs: {
                  connect: {
                    id: cId.vehicles.branchId,
                  },
                },
              },
            },
          },
        });
      });
    }

    res.status(200).json(checkCert);
  } catch (err) {
    res.status(500).end({ message: err.message });
  }
};

export default handler;
