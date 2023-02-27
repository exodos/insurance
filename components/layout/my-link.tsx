import { forwardRef, HTMLProps } from "react";
import Link, { LinkProps } from "next/link";

const MyLink = forwardRef<
  HTMLAnchorElement,
  LinkProps & HTMLProps<HTMLAnchorElement>
>(({ href, children, ...rest }, ref) => {
  return (
    <Link href={href} passHref legacyBehavior>
      {/* <a
        ref={ref}
        {...rest}
        className="text-gray-700 block px-1 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
      > */}
      {children}
      {/* </a> */}
    </Link>
  );
});

MyLink.displayName = "MyLink";

export default MyLink;
