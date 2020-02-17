import React, { useEffect, useState, useRef, useContext } from 'react';
import { TableHeaderProps, SortIndicator } from 'react-virtualized/dist/es/Table';
import styles from '../BookTable/BookTable.module.scss';
import { AppContext } from '../../App';


// Filtering trigger and menu
export interface IHeaderFilterProps {
  data: string[];
  dataKey: string | undefined;
}

const TableHeaderFilter: React.FC<IHeaderFilterProps> = ({dataKey, data}) => {
  const [{filters}, dispatch] = useContext(AppContext);
  const [visible, setVisible] = useState(false);
  let containerRef: any = useRef();

  const className = styles['BookTable-filter'] + (visible ? ' '+styles['BookTable-filter-visible'] : '');
  const currentFilters = dataKey && filters[dataKey] ? filters[dataKey] : [];

  const getFiltersPayload = () => {
    if(!dataKey || !document) return filters;

    let thisFilter: string[] = [];

    document.querySelectorAll('input[name^=filter]').forEach((node: Element) => {
      let input = node as HTMLInputElement;
      if(input.checked) thisFilter.push(input.value);
    });
    
    let result = {...filters, [dataKey]: thisFilter};
    if(!thisFilter.length) delete result[dataKey];

    return result;
  }

  useEffect(() => {
    if(visible) {
      const documentOverlayClick = (event: MouseEvent) => {
        let target : any = event.target as HTMLElement;

        while(target !== null) {
          if(target === containerRef.current) break;
          target = target.parentNode;
        }

        if(!target) setVisible(false);
      }

      if(document)
        document.body.addEventListener('click', documentOverlayClick);

      return () => {
        if(document)
          document.body.removeEventListener('click', documentOverlayClick);
      }
    }
  }, [visible, containerRef]);

  return (
    <span 
      key="FilterTrigger"
      className={className} 
      onClick={event => event.stopPropagation()}
      ref={(ref) => containerRef.current = ref}
    >
      <span className={styles['BookTable-filter-trigger']} title="Filter by this column...">
        <img src="/filter.svg" alt="Filter" onClick={(event) => setVisible(true)} />
      </span>
      {visible ? (
        <div className={styles['BookTable-filter-menu']}>
          <div role="list" className={styles['BookTable-filter-menu-list']}>
            {data.map((name, key) => (
              <div key={key}>
                <label>
                  <input 
                    type="checkbox" 
                    value={name} 
                    defaultChecked={currentFilters.indexOf(name) > -1}
                    name={`filter[${dataKey}][]`}
                  /> {name}
                </label>
              </div>
            ))}
          </div>
          <div className={styles['BookTable-filter-menu-buttons']}>
            <button onClick={() => {
              dispatch({
                type: 'changeFilters',
                payload: getFiltersPayload()
              })
              setVisible(false);
            }}>Filter</button>
            <button onClick={() => setVisible(false)}>Cancel</button>
          </div>
        </div>
      ) : null}
    </span>
  );
}

// Override header render to add filtering
export function filteredHeader({
  dataKey,
  label,
  sortBy,
  sortDirection
}: TableHeaderProps, data: any) {
  const showSortIndicator = sortBy === dataKey;

  const children = [
    <TableHeaderFilter key="filter" data={data} dataKey={dataKey} />,
    <span
      className="ReactVirtualized__Table__headerTruncatedText"
      key="label"
      title={typeof label === 'string' ? label : undefined}
    >
      {label}
    </span>,
  ];

  if (showSortIndicator) {
    children.push(
      <SortIndicator key="SortIndicator" sortDirection={sortDirection} />,
    );
  }

  return children;
}

export default TableHeaderFilter;