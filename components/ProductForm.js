import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { ReactSortable } from "react-sortablejs";
import $ from "jquery";
import "select2/dist/css/select2.min.css";
import "select2-bootstrap-theme/dist/select2-bootstrap.min.css";
import "select2/dist/js/select2.full.min.js";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  author: existingAuthor,
  pages: existingPages,
  width: existingWidth,
  height: existingHeight,
  thickness: existingThickness,
  unit: existingUnit,
  published_place: existingPublishedPlace,
  edition: existingEdition,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [category, setCategory] = useState(assignedCategory || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [author, setAuthor] = useState(existingAuthor || "");
  const [pages, setPages] = useState(existingPages || "");
  const [width, setWidth] = useState(existingWidth || "");
  const [height, setHeight] = useState(existingHeight || "");
  const [thickness, setThickness] = useState(existingThickness || "");
  const [unit, setUnit] = useState(existingUnit || "");
  const [edition, setEdition] = useState(existingEdition || "");
  const [publishedPlace, setPublishedPlace] = useState(existingPublishedPlace || "");

  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
      $("#categorySelect").select2();
    });

    axios.get("/api/authors").then((result) => {
      setAuthors(result.data);
      $("#authorSelect").select2();
    });
  }, []);

  const selectedCategory = $("#categorySelect").val();
  const selectedAuthor = $("#authorSelect").val();

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      title,
      description,
      author: selectedAuthor,
      price,
      images,
      category: selectedCategory,
      pages,
      width,
      height,
      thickness,
      unit,
      published_place: publishedPlace,
      edition
    };
    if (_id) {
      //update
      await axios.put("/api/products", { ...data, _id });
    } else {
      //create
      await axios.post("/api/products", data);
    }
    setGoToProducts(true);
  }

  if (goToProducts) {
    router.push("/products");
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      try {
        const response = await axios.post("/api/upload", data);
        const uploadedLinks = response.data.links.map(
          (linkObj) => linkObj.link
        );
        setImages((oldImages) => [...oldImages, ...uploadedLinks]);
      } catch (error) {
        console.error(error);
        // Handle the error here (display a message, etc.)
      }
      setIsUploading(false);
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  return (
    <form onSubmit={saveProduct} encType="multipart/form-data" className="">
      <label>Product name</label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />

      <label>Category</label>
      <select
        id="categorySelect"
        defaultValue={category}
      >
        <option value="">Uncategorized</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id} selected={c._id === assignedCategory}            >
              {c.name}
            </option>
          ))}
      </select>

      <label>Author</label>
      <select
        id="authorSelect"
        defaultValue={author}
      >
        <option value="">Select Author</option>
        {authors.length > 0 &&
          authors.map((a) => (
            <option key={a._id} value={a._id} selected={a._id === existingAuthor}>
              {a.name}
            </option>
          ))}
      </select>

      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200"
              >
                <img src={link} alt="" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Add image</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>

      <label>Description</label>
      <textarea
        rows="4"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      ></textarea>

      <label>Price</label>
      <input
        type="text"
        placeholder="product price"
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />

      <label>Pages</label>
      <input
        type="text"
        placeholder="product pages"
        value={pages}
        onChange={(ev) => setPages(ev.target.value)}
      />

      <>
        <label>Width</label>
        <input
          type="text"
          placeholder="product width"
          value={width}
          onChange={(ev) => setWidth(ev.target.value)}
        />
      </>

        <label>Height</label>
        <input
          type="text"
          placeholder="product height"
          value={height}
          onChange={(ev) => setHeight(ev.target.value)}
        />

        <label>Thickness</label>
        <input
          type="text"
          placeholder="product thickness"
          value={thickness}
          onChange={(ev) => setThickness(ev.target.value)}
        />

        <label>Unit</label>
        <input
          type="text"
          placeholder="product uit"
          value={unit}
          onChange={(ev) => setUnit(ev.target.value)}
        />
    
    
        <label>Published Place</label>
        <input
          type="text"
          placeholder="product published place"
          value={publishedPlace}
          onChange={(ev) => setPublishedPlace(ev.target.value)}
        />

        <label>Edition</label>
        <input
          type="text"
          placeholder="product edition"
          value={edition}
          onChange={(ev) => setEdition(ev.target.value)}
        />

      <button type="submit" className="btn-primary">Save</button>
    </form>
  );
}
