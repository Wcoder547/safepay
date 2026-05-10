import { createFileRoute } from '@tanstack/react-router'
import   { FraudLogPage } from '@/pages/fraud'

export const Route = createFileRoute('/fraud')({
  component: FraudLogPage,
})


