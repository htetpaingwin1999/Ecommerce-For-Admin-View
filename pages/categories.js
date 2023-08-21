import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from 'react-data-table-component';
import Highlighter from 'react-highlight-words';
import { withSwal } from 'react-sweetalert2';

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories', data);
    }
    setName('');
    setParentCategory('');
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  }

  function deleteCategory(category) {
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        const { _id } = category;
        await axios.delete('/api/categories?_id=' + _id);
        fetchCategories();
      }
    });
  }

  function handleSearch(e) {
    setSearchText(e.target.value.toLowerCase());
  }

  const columns = [
    {
      name: 'Category name',
      selector: 'name',
      sortable: true,
      cell: row => (
        <Highlighter
          highlightClassName="search-highlight"
          searchWords={[searchText]}
          autoEscape={true}
          textToHighlight={row.name}
        />
      ),
    },
    {
      name: 'Parent category',
      selector: 'parent.name',
      sortable: true,
      cell: row => (
        <Highlighter
          highlightClassName="search-highlight"
          searchWords={[searchText]}
          autoEscape={true}
          textToHighlight={row.parent?.name || ''}
        />
      ),
    },
    {
      name: 'Action',
      cell: row => (
        <>
          <button className="btn-default mr-1" onClick={() => editCategory(row)}>
            Edit
          </button>
          <button className="btn-red" onClick={() => deleteCategory(row)}>
            Delete
          </button>
        </>
      ),
    },
  ];

  const customRowStyles = {
    rows: {
      style: {
        fontSize: '17px',
        '&:nth-child(odd)': {
          backgroundColor: '#D9E1F2',
        },
        '&:nth-child(even)': {
          backgroundColor: '#FFFFFF',
        },
      },
    },
    cells: {
      style: {
        padding: '7px',
        width: '150px',
      },
    },
    headCells: {
      style: {
        textAlign: 'center',
        padding: '7px',
        fontWeight: 'bold',
        color: '#FFFFFF',
        backgroundColor: '#4472C4',
      },
    },
  };

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : 'Create new category'}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={'Category name'}
            onChange={ev => setName(ev.target.value)}
            value={name} />
          <select
            onChange={ev => setParentCategory(ev.target.value)}
            value={parentCategory}>
            <option value="">No parent category</option>
            {categories.length > 0 && categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName('');
                setParentCategory('');
              }}
              className="btn-default">Cancel</button>
          )}
          <button type="submit"
            className="btn-primary py-1">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <>
          <h2>Categories List</h2>
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={handleSearch}
          />
          <DataTable
            columns={columns}
            data={categories}
            pagination
            highlightOnHover
            striped
            dense
            customStyles={customRowStyles}
            />
        </>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => (
  <Categories swal={swal} />
));
