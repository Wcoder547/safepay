import { createFileRoute } from '@tanstack/react-router'
import   { NotificationsPage } from '@/pages/notification'

export const Route = createFileRoute('/notification')({
  component: NotificationsPage,
})


