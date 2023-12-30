import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import DiscountByAmountForm from "@/components/DiscountByAmountForm";

export default function EditDiscountByAmountPage() {
    const [discountByAmountInfo, setDiscountByAmountInfo] = useState(null);
    const router = useRouter();
    const {id} = router.query;
    useEffect(() => {
      if (!id) {
        return;
      }
      axios.get('/api/discountbyamount?id='+id).then(response => {
        setDiscountByAmountInfo(response.data);
        console.log(response.data);
      });
    }, [id]);
  return (
    <Layout>
      <h1>Edit Discount By Amount </h1>
      {discountByAmountInfo && (
        <DiscountByAmountForm {...discountByAmountInfo} />
      )}
    </Layout>
  );
}