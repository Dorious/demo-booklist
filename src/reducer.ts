export default (state: any, action: any) => {
  switch (action.type) {
    case 'showLoading':
      return {
        ...state,
        loading: true
      };

    case 'loadBooks':
      return {
        ...state,
        loading: false,
        books: action.payload,
      };

    case 'changeSorting':
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortDirection: action.payload.sortDirection
      };

    case 'changeFilters':
      return {
        ...state,
        filters: action.payload
      }
    
    case 'setVisibleCount':
      return {
        ...state,
        visibleCount: action.payload
      }

    default:
      return state;
  }
};