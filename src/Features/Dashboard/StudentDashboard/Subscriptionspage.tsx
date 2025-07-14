import { useQuery } from "@tanstack/react-query";
import { GetSubscriptions } from "./services/GetSubscriptions";

const Subscriptionspage = () => {
    const { data, isPending, error } = useQuery({
    queryKey: ["studentsDash"],
    queryFn: GetSubscriptions,
  });
    return ( <>
    <div>
        </div></> );
}
 
export default Subscriptionspage;