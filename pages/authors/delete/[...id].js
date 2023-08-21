import Layout from "@/components/Layout";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";

export default function DeleteProductPage() {
  const router = useRouter();
  const [authorInfo,setAuthorInfo] = useState();
  const {id} = router.query;
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get('/api/authors?id='+id).then(response => {
      setAuthorInfo(response.data);
    });
  }, [id]);
  function goBack() {
    router.push('/authors');
  }
  async function deleteAuthors() {
    await axios.delete('/api/authors?id='+id);
    goBack();
  }
  return (
    <Layout>
      <h1 className="text-center">Do you really want to delete
        &nbsp;&quot;{authorInfo?.name}&quot;?
      </h1>
      <div className="flex gap-2 justify-center">
        <button
          onClick={deleteAuthors}
          className="btn-red">Yes</button>
        <button
          className="btn-default"
          onClick={goBack}>
          NO
        </button>
      </div>
    </Layout>
  );
}
