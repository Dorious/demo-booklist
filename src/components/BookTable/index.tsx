import React, { useContext, useEffect } from 'react';
import BookTable from './BookTable';
import { AppContext } from '../../App';
import axios from 'axios';

const BookTableContainer: React.FC = () => {
  const [state, dispatch] = useContext(AppContext);

  useEffect(() => {
    // Load book data on load
    if(!state.books.length && !state.loading) {
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

  return <BookTable list={state.books} />
}

export default BookTableContainer;