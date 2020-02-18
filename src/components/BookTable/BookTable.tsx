import React from 'react';
import {AutoSizer, Column, Table, SortDirectionType, SortDirection } from 'react-virtualized';
import 'react-virtualized/styles.css';
import styles from './BookTable.module.scss';
import loadingGif from './images/loading.gif';
import { TableHeaderProps, TableRowProps } from 'react-virtualized/dist/commonjs/Table';
import { filteredHeader } from '../TableHeaderFilter';
import md5 from 'md5';

export enum Genders {
  male = 'male',
  female = 'female',
}

export interface IBook {
	name: string;
	author: {
    name: string;
    gender: Genders;
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
    [prop: string]: string[];
  };
  filterGenres: string[];
  filterSexes: string[];
  filterFunctions?: {
    [prop: string]: (value: IBook, haystack: string[]) => boolean;
  };
}

export function rowRenderer({
  className,
  columns,
  index,
  key,
  onRowClick,
  onRowDoubleClick,
  onRowMouseOut,
  onRowMouseOver,
  onRowRightClick,
  rowData,
  style,
}: TableRowProps) {
  let a11yProps : any = {'aria-rowindex': index + 1};

  if (
    onRowClick ||
    onRowDoubleClick ||
    onRowMouseOut ||
    onRowMouseOver ||
    onRowRightClick
  ) {
    a11yProps['aria-label'] = 'row';
    a11yProps.tabIndex = 0;

    if (onRowClick) {
      a11yProps.onClick = (event: React.MouseEvent<any, MouseEvent>) => onRowClick({event, index, rowData});
    }
    if (onRowDoubleClick) {
      a11yProps.onDoubleClick = (event: React.MouseEvent<any, MouseEvent>) =>
        onRowDoubleClick({event, index, rowData});
    }
    if (onRowMouseOut) {
      a11yProps.onMouseOut = (event: React.MouseEvent<any, MouseEvent>) => onRowMouseOut({event, index, rowData});
    }
    if (onRowMouseOver) {
      a11yProps.onMouseOver = (event: React.MouseEvent<any, MouseEvent>) => onRowMouseOver({event, index, rowData});
    }
    if (onRowRightClick) {
      a11yProps.onContextMenu = (event: React.MouseEvent<any, MouseEvent>) =>
        onRowRightClick({event, index, rowData});
    }
  }

  let pD = new Date(rowData.date);
  let dateString = `${pD.getMonth()}${pD.getDate()}`;

  
  if(rowData.genre === 'Horror' && dateString === '931') {
    style.backgroundColor = '#ccc';
  }

  return (
    <div
      {...a11yProps}
      className={className}
      key={key}
      role="row"
      style={style}>
      {columns}
    </div>
  );
}

const BookTable: React.FC<IBookTableProps> = ({
  filterSexes, filterGenres, list, loading, sort, sortBy, sortDirection
}) => {
  const loadingClass = styles['BookTable-loading'] + (
    loading ? ' '+styles['BookTable-loading-visible'] : ''
  );

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
            rowCount={list.length}
            sort={sort}
            sortBy={sortBy}
            sortDirection={sortDirection}
            rowRenderer={rowRenderer}
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
            rowGetter={({index}) => list[index]}
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
                const img = rowData.image.replace(/460\/640$/, '34/48');
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
  sortDirection: SortDirection.DESC
}

export default React.memo(BookTable);