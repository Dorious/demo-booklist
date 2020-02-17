import React, { useContext, useEffect } from 'react';
import BookTable from './BookTable';
import { AppContext } from '../../App';
import axios from 'axios';

const BookTableContainer: React.FC = () => {
  const [{books, loading}, dispatch] = useContext(AppContext);

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
  />
}

export default BookTableContainer;