import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import DiscountByProductForm from "@/components/DiscountByProductForm";

export default function EditDiscountByProductPage() {
    const [discountByProductInfo, setDiscountByProductInfo] = useState(null);
    const router = useRouter();
    const {id} = router.query;
    useEffect(() => {
      if (!id) {
        return;
      }
      axios.get('/api/discountbyproducts?id='+id).then(response => {
        setDiscountByProductInfo(response.data);
        console.log(response.data);
      });
    }, [id]);
  return (
    <Layout>
      <h1>Edit Discount By Product </h1>
      {discountByProductInfo && (
        <DiscountByProductForm {...discountByProductInfo} />
      )}
    </Layout>
  );
}