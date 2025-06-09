import { h1, h2, h3, h4 } from "@shadow-panda/styled-system/recipes"

type HeadingProps = {
  children: React.ReactNode
  level?: "1" | 1 | "2" | 2 | "3" | 3 | "4" | 4
}

const Heading = ({ level = "1", children }: HeadingProps) => {
  if (level === "1" || level === 1) {
    return <h1 className={h1()}>{children}</h1>
  }

  if (level === "2" || level === 2) {
    return <h2 className={h2()}>{children}</h2>
  }

  if (level === "3" || level === 3) {
    return <h3 className={h3()}>{children}</h3>
  }

  if (level === "4" || level === 4) {
    return <h4 className={h4()}>{children}</h4>
  }

  throw new Error(`Invalid heading level: ${level}. Use 1, 2, 3, or 4.`)
}

export default Heading
