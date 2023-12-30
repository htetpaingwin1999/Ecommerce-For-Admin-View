import Layout from "@/components/Layout";
import ProductStockForm from "@/components/ProductStockForm";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";

export default function EditProductStockPage() {
    const [productStockInfo, setProductStockInfo] = useState(null);
    const router = useRouter();
    const {id} = router.query;
    useEffect(() => {
      if (!id) {
        return;
      }
      axios.get('/api/productstocks?id='+id).then(response => {
        setProductStockInfo(response.data);
        console.log(response.data);
      });
    }, [id]);
  return (
    <Layout>
      <h1>Edit Product Stock</h1>
      {productStockInfo && (
        <ProductStockForm {...productStockInfo} />
      )}
    </Layout>
  );
}