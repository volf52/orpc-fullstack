import NextLink, { type LinkProps as NextLinkProps } from "next/link"
import { Link } from "@/components/ui/link"

type NavLinkProps = Omit<NextLinkProps, "href"> & {
  to: string
  children: React.ReactNode
}

const NavLink = ({ children, to, ...rest }: NavLinkProps) => (
  <Link asChild>
    <NextLink href={to} {...rest}>
      {children}
    </NextLink>
  </Link>
)

export default NavLink
