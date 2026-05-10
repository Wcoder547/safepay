export const QUERY_KEYS = {
  user:           ["user"],
  wallet:         ["wallet"],
  walletLogs:     ["wallet-logs"],
  transactions:   ["transactions"],
  transaction:    (id) => ["transactions", id],
  receipt:        (id) => ["receipt", id],
  notifications:  ["notifications"],
};