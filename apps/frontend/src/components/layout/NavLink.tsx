import NextLink, { type LinkProps as NextLinkProps } from "next/link"
import { Link } from "@/components/ui/link"

type NavLinkProps = Omit<NextLinkProps, "href"> & {
  to: string
  children: React.ReactNode
  noHover?: boolean
}

const NavLink = ({ children, noHover, to, ...rest }: NavLinkProps) => (
  <Link asChild _hover={noHover ? { textDecoration: "none" } : undefined}>
    <NextLink href={to} {...rest}>
      {children}
    </NextLink>
  </Link>
)

export default NavLink
