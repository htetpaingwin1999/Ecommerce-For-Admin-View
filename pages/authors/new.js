import AuthorForm from "@/components/AuthorForm";
import Layout from "@/components/Layout";
import { Author } from "@/models/Author";
import { useEffect } from "react";

export default function NewAuthor() {
  return (
    <Layout>
      <h1>New Author</h1>
      <AuthorForm />
    </Layout>
  );
}