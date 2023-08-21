import Layout from "@/components/Layout";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";
import AuthorForm from "@/components/AuthorForm";

export default function EditProductPage() {
  const [authorInfo, setAuthorInfo] = useState(null);
  const router = useRouter();
  const {id} = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/authors?id='+id).then(response => {
      setAuthorInfo(response.data);
    });
  }, [id]);
  return (
    <Layout>
      <h1>Edit Authors</h1>
      {authorInfo && (
        <AuthorForm {...authorInfo} />
      )}
    </Layout>
  );
}