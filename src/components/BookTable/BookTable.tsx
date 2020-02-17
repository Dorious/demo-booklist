import React from 'react';
import {AutoSizer, Column, Table} from 'react-virtualized';
import 'react-virtualized/styles.css';
import styles from './BookTable.module.scss';
import loadingGif from './loading.gif';
 
export interface IBook {
	name: string,
	author: {

	}
}

export interface IBookTableProps {
  list: IBook[],
  loading?: boolean
}

const BookTable: React.FC<IBookTableProps> = ({list, loading}) => {
  let loadingClass = styles['BookTable-loading'] + (
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
            headerHeight={20}
            rowHeight={30}
            rowCount={list.length}
            rowGetter={({index}) => list[index]}>
            <Column 
              label="Name" 
              dataKey="name" 
              flexGrow={1}
              width={300}
              cellRenderer={({cellData, rowData, rowIndex}) => {
                let img = rowData.image.replace(/460\/640$/, '34/48');
                return <>
                  <img src={`${img}?${rowIndex}`} width={17} height={24} alt={cellData} /> {cellData}
                </>
              }}
            />
            <Column width={100} label="Author" dataKey="author" />
            <Column width={100} label="Genre" dataKey="genre" />
            <Column 
              width={100} 
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

export default React.memo(BookTable);