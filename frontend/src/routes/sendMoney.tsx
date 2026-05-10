import { createFileRoute } from '@tanstack/react-router'
import   { SendMoney } from '@/pages/sendMoney'

export const Route = createFileRoute('/sendMoney')({
  component: SendMoney,
})


