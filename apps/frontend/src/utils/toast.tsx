import type { Omitt } from "@app/types"
import { type NotificationData, notifications } from "@mantine/notifications"
import { CircleAlert, CircleCheck, CircleX, TriangleAlert } from "lucide-react"

type ToastArgs = Omitt<NotificationData, "color">

const ToastDefaults: Omitt<NotificationData, "color" | "message"> = {
  withBorder: true,
  withCloseButton: true,
  autoClose: 5000,
  radius: "md",
}

export const toast = {
  success: (args: ToastArgs) =>
    notifications.show({
      ...ToastDefaults,
      color: "teal",
      icon: <CircleCheck size={20} />,
      ...args,
    }),
  error: (args: ToastArgs) =>
    notifications.show({
      ...ToastDefaults,
      color: "red",
      icon: <CircleX size={20} />,
      ...args,
    }),
  warning: (args: ToastArgs) =>
    notifications.show({
      ...ToastDefaults,
      color: "yellow",
      icon: <CircleAlert size={20} />,
      ...args,
    }),
  info: (args: ToastArgs) =>
    notifications.show({
      ...ToastDefaults,
      icon: <TriangleAlert size={20} />,
      color: "blue",
      ...args,
    }),
} as const
