import { useQuery } from "@tanstack/react-query";
import { getCnbDailyRates } from "../api/cnb";

export function useCnbDailyRates() {
  return useQuery({
    queryKey: ["cnbDailyRates"],
    queryFn: getCnbDailyRates
  });
}