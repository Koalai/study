import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { GET_DATABASE} from "./queries/queries";
import { useQuery } from "@apollo/client";

const App = () => {
  const [page, setPage] = useState("authors");
  const personResult = useQuery(GET_DATABASE)

  console.log(personResult.data)

  if (personResult.loading) {
    return <div>Loading </div>
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      <Authors show={page === "authors"} authors={personResult.data.allAuthor} />

      <Books show={page === "books"} books={personResult.data.allBook} />

      <NewBook show={page === "add"} />
    </div>
  );
};

export default App;
