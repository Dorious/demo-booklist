import React, { useContext, useEffect } from 'react';
import BookTable, { IBook } from './BookTable';
import { AppContext } from '../../App';
import axios from 'axios';
import { SortDirection } from 'react-virtualized';

// Collect genres and sexes after data loads
export interface BaseIndex {
  [prop: string]: any;
}
const filterGenres: IListMemo = {};
const filterSexes: IListMemo = {};

// Memo container for sorted lists
export type IListMemo = BaseIndex
const listMemo: IListMemo = {};

// This are functions to override .filter function for specific 'dataKey'
export type IFilterFunctions = BaseIndex
export const filterFunctions: IFilterFunctions = {
  author: (book: IBook, haystack: string[]) => {
    return haystack.indexOf(book.author.gender) > -1;
  }
};

const BookTableContainer: React.FC = () => {
  const [{
    books, filters, loading, sortBy, sortDirection, visibleCount
  }, dispatch] = useContext(AppContext);

  let listMemoKey = `${sortBy} ${sortDirection}`;

  // Add filter values to memo key
  const filterKeys = Object.keys(filters);
  filterKeys.forEach((key: string) => {
    if(filters[key].length) listMemoKey += ` ${key}:${filters[key].join('|')}`;
  });

  // Memorize the sort result so it doesn't do it everytime.
  let bookList: IBook[] = listMemo[listMemoKey];

  // This could be refactored to separate function because looks ugly here.
  if(!bookList || !bookList.length) {
    console.log(`No memo for '${listMemoKey}', doin' it...`);

    const dir = sortDirection === SortDirection.DESC ? -1 : 1;

    // Clone list so we don't have reference.
    bookList = [...books];

    // Apply filters
    if(filterKeys.length) {
      bookList = bookList.filter((value: IBook) => {
        let show = true;

        filterKeys.forEach((key: string) => {
          const func = filterFunctions && typeof(filterFunctions[key]) === 'function' ? filterFunctions[key] : (value: IBook, haystack: string[]): boolean => {
            return haystack.indexOf(value[key]) > -1;
          };

          if(show && filters[key]) show = func(value, filters[key]);
        });

        return show;
      });
    }

    const sorting = (a: IBook, b: IBook) => {
      // Collect genres and sexes
      filterGenres[a['genre']] = 1;
      filterSexes[a['author']['gender']] = 1;
      
      // This is ugly and should be rectored:
      const aSort = sortBy === 'author' ? a['author']['name'] : a[sortBy];
      const bSort = sortBy === 'author' ? b['author']['name'] : b[sortBy];

      if(aSort===bSort) return 0;
      return aSort > bSort ? dir : -dir;
    }

    bookList.sort(sorting); 
    
    listMemo[listMemoKey] = bookList;
  }
  
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
    
    // Update visible count
    if(visibleCount !== bookList.length)
      dispatch({
        type: 'setVisibleCount',
        payload: bookList.length
      });

  }, [books, loading, dispatch, bookList, visibleCount]);

  const fG = Object.keys(filterGenres);
  const fS = Object.keys(filterSexes);

  fG.sort();
  fS.sort();

  return <BookTable 
    loading={loading} 
    list={bookList}
    filters={filters}
    filterGenres={fG}
    filterSexes={fS}
    sortBy={sortBy}
    sortDirection={sortDirection}
    sort={(info: any) => dispatch({
      type: 'changeSorting',
      payload: info
    })}
  />
}

export default BookTableContainer;