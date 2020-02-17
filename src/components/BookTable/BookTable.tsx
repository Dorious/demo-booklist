import React from 'react';
import {AutoSizer, Column, Table, SortDirectionType, SortDirection } from 'react-virtualized';
import 'react-virtualized/styles.css';
import styles from './BookTable.module.scss';
import loadingGif from './loading.gif';

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
  sortDirection?: SortDirectionType,
  sort?: any
}

// Memo container
export interface IListMemo {
  [prop: string]: any
}
let listMemo:IListMemo = {}

const BookTable: React.FC<IBookTableProps> = ({list, loading, sort, sortBy, sortDirection}) => {
  let loadingClass = styles['BookTable-loading'] + (
    loading ? ' '+styles['BookTable-loading-visible'] : ''
  );

  // Memorize the sort result so it doesn't do it everytime.
  let bookList:IBook[] = listMemo[`${sortBy} ${sortDirection}`];

  if(!bookList || !bookList.length) {
    console.log(`No memo for '${sortBy} ${sortDirection}'`);
    bookList = [...list]
    bookList.sort((a, b) => {
      let dir = sortDirection === SortDirection.DESC ? -1 : 1;
      return a[sortBy] > b[sortBy] ? dir : -dir;
    });
    listMemo[`${sortBy} ${sortDirection}`] = bookList;
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
                  <img src={`${img}?${rowIndex}`} width={17} height={24} alt={cellData} /> {cellData}
                </>
              }}
            />
            <Column 
              width={width*.32} 
              label="Author" 
              dataKey="author" 
              cellRenderer={({cellData, rowData, rowIndex}) => `${cellData.name} (${cellData.gender})`}
            />
            <Column 
              width={width*.18} 
              label="Genre" 
              dataKey="genre" 
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
  sortDirection: SortDirection.DESC
}

export default React.memo(BookTable);