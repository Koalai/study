import React from 'react'

function BookRecommend({show, books, user}) {
 
   if (!show) {
     return null;
   }
   console.log(user)


   const filteredBooks = books.filter(book => book.genres.includes(user.favoriteGenre))
 
 return (
   <div>
     <h1>Recommendations</h1>
     <h2>Books in your favorite genre: {user.favoriteGenre}</h2>
     <table>
       <tbody>
         <tr>
           <th></th>
           <th>author</th>
           <th>published</th>
         </tr>
         {filteredBooks.map((book) => (
           <tr key={book.id}>
             <td>{book.title}</td>
             <td>{book.author.name}</td>
             <td>{book.published}</td>
           </tr>
         ))}
       </tbody>
     </table>
   </div>
 );
}

export default BookRecommend