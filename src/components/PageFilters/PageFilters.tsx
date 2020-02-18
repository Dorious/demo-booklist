import React, { useContext } from 'react';
import styles from './PageFilters.module.scss';
import { AppContext } from '../../App';
 
const PageFilters: React.FC = () => {
  const [state] = useContext(AppContext);
  const allCount = state.books.length;
  const visibleCount = state.visibleCount;

  if(!allCount) return null;

  return (
    <div className={styles['PageFilters']}>
      All books: {state.books.length}
      {allCount !== visibleCount ? <>, Filtered: {visibleCount}</> : null}
    </div>
  )
};

export default PageFilters;