import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { walletApi } from "../api/endpoints/wallet.api";
import { QUERY_KEYS } from "../api/queryKeys";

// ─────────────────────────────────────────
// GET wallet balance
// ─────────────────────────────────────────
export const useWallet = () => {
  return useQuery({
    queryKey: QUERY_KEYS.wallet,
    queryFn:  async () => {
      const { data } = await walletApi.getBalance();
      return data.data.wallet;
    },
    refetchInterval: 1000 * 30, // auto-refresh every 30 seconds
  });
};

// ─────────────────────────────────────────
// TOP UP wallet
// ─────────────────────────────────────────
export const useTopUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (amount) => walletApi.topUp(amount),

    onSuccess: () => {
      // Refresh balance + logs after top up
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallet });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.walletLogs });
    },
  });
};

// ─────────────────────────────────────────
// SEND money ⭐ core feature
// ─────────────────────────────────────────
export const useSendMoney = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => walletApi.sendMoney(payload),

    onSuccess: () => {
      // Invalidate everything that changes after a transfer
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallet });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.walletLogs });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.transactions });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications });
    },
  });
};

// ─────────────────────────────────────────
// GET transaction history (paginated)
// ─────────────────────────────────────────
export const useTransactionHistory = (params = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.transactions, params],
    queryFn:  async () => {
      const { data } = await walletApi.getHistory(params);
      return data.data;
    },
    keepPreviousData: true, // smooth pagination — keeps old data while fetching new
  });
};

// ─────────────────────────────────────────
// GET wallet audit logs (paginated)
// ─────────────────────────────────────────
export const useWalletLogs = (params = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.walletLogs, params],
    queryFn:  async () => {
      const { data } = await walletApi.getLogs(params);
      return data.data;
    },
    keepPreviousData: true,
  });
};