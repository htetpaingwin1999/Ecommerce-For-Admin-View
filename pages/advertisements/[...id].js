import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import AdvertisementForm from "@/components/AdvertisementForm";


export default function EditAdvertisementPage() {
    const [advertisementInfo, setAdvertisementInfo] = useState(null);
    const router = useRouter();
    const {id} = router.query;
    useEffect(() => {
      if (!id) {
        return;
      }
      axios.get('/api/advertisements?_id='+id).then(response => {
        setAdvertisementInfo(response.data);
        console.log(advertisementInfo);
      });
    }, []);
  return (
    <Layout>
      <h1>Edit Advertisement </h1>
      {advertisementInfo && (
        <AdvertisementForm {...advertisementInfo} />
      )}
    </Layout>
  );
}