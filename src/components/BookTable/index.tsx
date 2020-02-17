import React, { useContext, useEffect } from 'react';
import BookTable, { IBook } from './BookTable';
import { AppContext } from '../../App';
import axios from 'axios';

const BookTableContainer: React.FC = () => {
  const [{
    books, filters, loading, sortBy, sortDirection
  }, dispatch] = useContext(AppContext);

  useEffect(() => {
    // Load book data on load
    if(!books.length && !loading) {
      dispatch({type: 'showLoading'});

      axios
        .get('/data.json')
        .then(({data}) => {
          dispatch({
            type: 'loadBooks',
            payload: data
          });
        });
    }
  });

  return <BookTable 
    loading={loading} 
    list={books}
    filters={filters}
    filterFunctions={{
      author: (book: IBook, haystack: string[]) => {
        return haystack.indexOf(book.author.gender) > -1;
      }
    }}
    sortBy={sortBy}
    sortDirection={sortDirection}
    sort={(info: any) => dispatch({
      type: 'changeSorting',
      payload: info
    })}
  />
}

export default BookTableContainer;