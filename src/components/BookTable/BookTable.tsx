import React from 'react';
import {AutoSizer, Column, Table, SortDirectionType, SortDirection } from 'react-virtualized';
import 'react-virtualized/styles.css';
import styles from './BookTable.module.scss';
import loadingGif from './images/loading.gif';
import { TableHeaderProps } from 'react-virtualized/dist/es/Table';
import { filteredHeader } from '../TableHeaderFilter';
import md5 from 'md5';

export enum Genders {
  male = 'male',
  female = 'female',
}

export interface IBook {
	name: string;
	author: {
    name: string,
    gender: Genders
  };
  [prop: string]: any;
}

export interface IBookTableProps {
  list: IBook[];
  loading?: boolean;
  sortBy: string;
  sortDirection?: SortDirectionType;
  sort?: any;
  filters: {
    [prop: string]: string[]
  };
  filterFunctions?: {
    [prop: string]: (value: IBook, haystack: string[]) => boolean
  }
}

// Memo container for sorted lists
export interface IListMemo {
  [prop: string]: any
}
let listMemo: IListMemo = {};

// Collect genres and sexes after data loads
let firstRun: boolean = true;
let filterGenres: string[] = [];
let filterSexes: string[] = [];

const BookTable: React.FC<IBookTableProps> = ({
  filters, filterFunctions, list, loading, sort, sortBy, sortDirection
}) => {
  let loadingClass = styles['BookTable-loading'] + (
    loading ? ' '+styles['BookTable-loading-visible'] : ''
  );

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
    bookList = [...list];

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
      
      if(a===b) return 0;
      return a[sortBy] > b[sortBy] ? dir : -dir
    });

    filterGenres.sort();
    filterSexes.sort();
    
    listMemo[listMemoKey] = bookList;
    if(bookList.length) firstRun = false;
  }

	return (
    <section role="table" className={styles['BookTable']}>
      <div className={loadingClass}>
        <img src={loadingGif} alt="Loading..." />
      </div>
      <AutoSizer>
        {({height, width}) => (
          <Table
            width={width}
            height={height}
            headerHeight={40}
            rowHeight={40}
            rowCount={bookList.length}
            sort={sort}
            sortBy={sortBy}
            sortDirection={sortDirection}
            headerRowRenderer={({
              className,
              columns,
              style,
            }) => {
              return (
                <div 
                  className={className+' '+styles['BookTable-headerRow']} 
                  role="row" 
                  style={style}
                >
                  {columns}
                </div>
              );
            }}
            headerClassName={styles['BookTable-headerColumn']}
            rowClassName={styles['BookTable-rowColumn']}
            rowGetter={({index}) => bookList[index]}
            onRowClick={({rowData}) => {
              window.open(
                `https://google.com/search?q=${encodeURIComponent(`${rowData.author.name} "${rowData.name}"`)}`
              );
            }}
          >
            <Column 
              label="Name" 
              dataKey="name" 
              flexGrow={1}
              width={width*.40}
              cellRenderer={({cellData, rowData, rowIndex}) => {
                let img = rowData.image.replace(/460\/640$/, '34/48');
                return <>
                  <img src={`${img}?${md5(JSON.stringify(rowData))}`} width={17} height={24} alt={cellData} /> {cellData}
                </>
              }}
            />
            <Column 
              width={width*.32} 
              label="Author" 
              dataKey="author" 
              cellRenderer={({cellData, rowData, rowIndex}) => `${cellData.name} (${cellData.gender})`}
              headerRenderer={(headerProps: TableHeaderProps) => (
                filteredHeader(headerProps, filterSexes)
              )}
            />
            <Column 
              width={width*.18} 
              label="Genre" 
              dataKey="genre" 
              headerRenderer={(headerProps: TableHeaderProps) => (
                filteredHeader(headerProps, filterGenres)
              )}
            />
            <Column 
              width={width*.18} 
              label="Published" 
              dataKey="date" 
              cellRenderer={({cellData}) => new Date(cellData).toLocaleDateString()} 
            />
          </Table>
        )}
      </AutoSizer>
    </section>
	)
}

BookTable.defaultProps = {
  loading: true,
  sortBy: 'date',
  sortDirection: SortDirection.DESC,
  filterFunctions: {}
}

export default React.memo(BookTable);