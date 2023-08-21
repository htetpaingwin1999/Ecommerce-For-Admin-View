import {useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";

export default function AuthorForm({
  _id,
  name:existingName,
}) {
  const [name,setName] = useState(existingName || '');
  const [goToAuthors,setGoToAuthors] = useState(false);
  const router = useRouter();
  
  async function saveAuthor(ev) {
    ev.preventDefault();
    const data = {name};
    if (_id) {
      //update
      await axios.put('/api/authors', {...data,_id});
    } else {
      //create
      await axios.post('/api/authors', data);
    }
    setGoToAuthors(true);
  }
  if (goToAuthors) {
    router.push('/authors');
  }
  return (
      <form onSubmit={saveAuthor}>
        <label>Author name</label>
        <input
          type="text"
          placeholder="author name"
          value={name}
          onChange={ev => setName(ev.target.value)}/>
        <button
          type="submit"
          className="btn-primary">
          Save
        </button>
      </form>
  );
}
