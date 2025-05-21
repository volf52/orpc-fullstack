import {
  NavLink as RRLink,
  type NavLinkProps as RRNavLinkProps,
} from "react-router"
import { Link } from "@/components/ui/link"

type NavLinkProps = Omit<RRNavLinkProps, "to"> & {
  to: string
  children: React.ReactNode
  noHover?: boolean
}

const NavLink = ({ children, noHover, to, ...rest }: NavLinkProps) => (
  <Link asChild _hover={noHover ? { textDecoration: "none" } : undefined}>
    <RRLink to={to} {...rest}>
      {children}
    </RRLink>
  </Link>
)

export default NavLink
