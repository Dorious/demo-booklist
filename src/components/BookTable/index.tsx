import React, { useContext, useEffect } from 'react';
import BookTable, { IBook } from './BookTable';
import { AppContext } from '../../App';
import axios from 'axios';
import { SortDirection } from 'react-virtualized';

// Memo container for sorted lists
export interface IListMemo {
  [prop: string]: any
}
let listMemo: IListMemo = {};

// Collect genres and sexes after data loads
let firstRun: boolean = true;
let filterGenres: string[] = [];
let filterSexes: string[] = [];

export interface IFilterFunctions {
  [prop: string]: any
}

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
  filterKeys.forEach((key:string) => {
    if(filters[key].length) listMemoKey += ` ${key}:${filters[key].join('|')}`;
  });

  // Memorize the sort result so it doesn't do it everytime.
  let bookList:IBook[] = listMemo[listMemoKey];

  // This could be refactored to separate function because looks ugly here.
  if(!bookList || !bookList.length) {
    console.log(`No memo for '${listMemoKey}', doin' it...`);

    let dir = sortDirection === SortDirection.DESC ? -1 : 1;

    // Clone list so we don't have reference.
    bookList = [...books];

    // Apply filters
    if(filterKeys.length) {
      bookList = bookList.filter((value: IBook) => {
        let show: boolean = true;

        filterKeys.forEach((key: string) => {
          let func = filterFunctions && typeof(filterFunctions[key]) === 'function' ? filterFunctions[key] : (value: IBook, haystack: string[]): boolean => {
            return haystack.indexOf(value[key]) > -1;
          };

          if(show && filters[key]) show = func(value, filters[key]);
        });

        return show;
      });
    }

    bookList.sort((a, b) => {
      // Collect genres and sexes
      if(firstRun && filterGenres.indexOf(a['genre']) < 0)
        filterGenres.push(a['genre']);
      
      if(firstRun && filterSexes.indexOf(a['author']['gender']) < 0)
        filterSexes.push(a['author']['gender']);
      
      // This is ugly and should be rectored:
      let aSort = sortBy === 'author' ? a['author']['name'] : a[sortBy];
      let bSort = sortBy === 'author' ? b['author']['name'] : b[sortBy];

      if(aSort===bSort) return 0;
      return aSort > bSort ? dir : -dir;
    });

    filterGenres.sort();
    filterSexes.sort();
    
    listMemo[listMemoKey] = bookList;
    if(bookList.length) firstRun = false;
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

  return <BookTable 
    loading={loading} 
    list={bookList}
    filters={filters}
    filterGenres={filterGenres}
    filterSexes={filterSexes}
    sortBy={sortBy}
    sortDirection={sortDirection}
    sort={(info: any) => dispatch({
      type: 'changeSorting',
      payload: info
    })}
  />
}

export default BookTableContainer;