import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { FaFileInvoiceDollar, FaHome } from "react-icons/fa";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  // const session = await unstable_getServerSession(req, res, authOptions);
  // const userToken = await getToken({ req, secret });
  let navigation;

  try {
    if (!session) {
      res.status(400).json({ message: "UnAuthenticated Request" });
    } else if (session.user.memberships.role === "SUPERADMIN") {
      navigation = [
        { name: "Home", href: "/", icon: "FaHome", current: true },
        {
          name: "Users",
          href: "/admin/users",
          icon: "FaUserFriends",
          current: false,
        },
        {
          name: "Claims",
          icon: "FaCommentDollar",
          current: false,
          children: [
            { name: "Insured Claim", href: "/admin/claim" },
            { name: "Hit And Run Claim", href: "/admin/claim/hitAndRun" },
            { name: "UnInsured Claim", href: "/admin/claim/uninsured" },
          ],
        },
        {
          name: "Police Report",
          icon: "FaCarCrash",
          current: false,
          children: [
            { name: "Insured", href: "/admin/policereport" },
            { name: "Uninsured", href: "/admin/policereport/uninsured" },
            { name: "Hit And Run", href: "/admin/policereport/hitAndRun" },
          ],
        },
        {
          name: "Insurance",
          icon: "FaItalic",
          current: false,
          children: [
            { name: "Insurer", href: "/admin/organizations" },
            { name: "Branch", href: "/admin/branchs" },
          ],
        },
        {
          name: "Insured",
          href: "/admin/insured",
          icon: "FaUserCheck",
          current: false,
        },
        {
          name: "Vehicle",
          icon: "FaCar",
          current: false,
          children: [
            { name: "All Vehicle", href: "/admin/vehicle" },
            { name: "Approved", href: "/admin/vehicle/approved" },
            { name: "Suspended", href: "/admin/vehicle/suspended" },
          ],
        },
        {
          name: "Certificate",
          href: "/admin/certificate",
          icon: "FaCertificate",
          current: false,
        },
        {
          name: "Tariff",
          href: "/admin/tariff",
          icon: "FaCcAmazonPay",
          current: false,
        },
      ];
    } else if (session?.user.memberships.role === "INSURER") {
      navigation = [
        { name: "Home", href: "/insurer", icon: "FaHome", current: true },
        {
          name: "Users",
          href: "/insurer/users",
          icon: "FaUserFriends",
          current: false,
        },
        {
          name: "Branchs",
          href: "/insurer/branch",
          icon: "FaCodeBranch",
          current: false,
        },
        {
          name: "Claims",
          href: "/insurer/claim",
          icon: "FaCommentDollar",
          current: false,
        },
        {
          name: "Police Report",
          href: "/insurer/policereport",
          icon: "FaCarCrash",
          current: false,
        },
        {
          name: "Insured",
          href: "/insurer/insured",
          icon: "FaUserCheck",
          current: false,
        },
        {
          name: "Vehicle",
          icon: "FaCar",
          current: false,
          children: [
            { name: "All Vehicle", href: "/insurer/vehicle" },
            { name: "Approved", href: "/insurer/vehicle/approved" },
            { name: "Suspended", href: "/insurer/vehicle/suspended" },
          ],
        },
        {
          name: "Certificate",
          href: "/insurer/certificate",
          icon: "FaCertificate",
          current: false,
        },
      ];
    } else if (session?.user.memberships.role === "BRANCHADMIN") {
      navigation = [
        { name: "Home", href: "/branch", icon: "FaHome", current: true },
        {
          name: "Users",
          href: "/branch/users",
          icon: "FaUserFriends",
          current: false,
        },
        {
          name: "Claims",
          href: "/branch/claim",
          icon: "FaCommentDollar",
          current: false,
        },
        {
          name: "Police Report",
          href: "/branch/policereport",
          icon: "FaCarCrash",
          current: false,
        },
        {
          name: "Insured",
          href: "/branch/insured",
          icon: "FaUserCheck",
          current: false,
        },
        {
          name: "Vehicle",
          icon: "FaCar",
          current: false,
          children: [
            { name: "All Vehicle", href: "/branch/vehicle" },
            { name: "Approved", href: "/branch/vehicle/approved" },
            { name: "Suspended", href: "/branch/vehicle/suspended" },
          ],
        },
        {
          name: "Certificate",
          href: "/branch/certificate",
          icon: "FaCertificate",
          current: false,
        },
      ];
    } else if (
      session?.user.memberships.role === "MEMBER" ||
      session?.user.memberships.role === "USER"
    ) {
      navigation = [
        { name: "Home", href: "/branch", icon: "FaHome", current: true },
        {
          name: "Users",
          href: "/branch/users",
          icon: "FaUserFriends",
          current: false,
        },
        {
          name: "Claims",
          href: "/branch/claim",
          icon: "FaCommentDollar",
          current: false,
        },
        {
          name: "Police Report",
          href: "/branch/policereport",
          icon: "FaCarCrash",
          current: false,
        },
        {
          name: "Insured",
          icon: "FaUserCheck",
          current: false,
          children: [
            { name: "Owner", href: "/branch/insured" },
            { name: "Vehicle", href: "/branch/vehicle" },
          ],
        },
        {
          name: "Certificate",
          href: "/branch/certificate",
          icon: "FaCertificate",
          current: false,
        },
      ];
    } else if (session?.user.memberships.role === "TRAFFICPOLICEADMIN") {
      navigation = [
        {
          name: "Home",
          href: "/police",
          icon: "FaHome",
          current: true,
        },
        {
          name: "Users",
          href: "/police/admin/users",
          icon: "FaUserFriends",
          current: false,
        },
        {
          name: "Branchs",
          href: "/police/admin/branch",
          icon: "FaCodeBranch",
          current: false,
        },

        {
          name: "Police Report",
          icon: "FaCarCrash",
          current: false,
          children: [
            { name: "Insured", href: "/police/admin/policereport" },
            { name: "Uninsured", href: "/police/admin/policereport/uninsured" },
            {
              name: "Hit And Run",
              href: "/police/admin/policereport/hitAndRun",
            },
          ],
        },
        {
          name: "Claims",
          icon: "FaCommentDollar",
          current: false,
          children: [
            { name: "Insured Claim", href: "/police/admin/claim" },
            {
              name: "Hit And Run Claim",
              href: "/police/admin/claim/hitAndRun",
            },
            { name: "UnInsured Claim", href: "/police/admin/claim/uninsured" },
          ],
        },
      ];
    } else if (session?.user.memberships.role === "TRAFFICPOLICEMEMBER") {
      navigation = [
        {
          name: "Home",
          href: "/police/user",
          icon: "FaHome",
          current: true,
        },
        {
          name: "Users",
          href: "/police/user/users",
          icon: "FaUserFriends",
          current: false,
        },
        {
          name: "Police Report",
          icon: "FaCarCrash",
          current: false,
          children: [
            { name: "Uninsured", href: "/police/user/policereport/uninsured" },
            {
              name: "Hit And Run",
              href: "/police/user/policereport/hitAndRun",
            },
          ],
        },
        {
          name: "Claims",
          icon: "FaCommentDollar",
          current: false,
          children: [
            { name: "Insured Claim", href: "/police/user/claim" },
            { name: "Hit And Run Claim", href: "/police/user/claim/hitAndRun" },
            { name: "UnInsured Claim", href: "/police/user/claim/uninsured" },
          ],
        },
      ];
    }
    // res.status(200).json(navigation);
    res.send(navigation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default handler;
