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
      }

    default:
      return state;
  }
};