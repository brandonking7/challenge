const INITIAL_STATE = {
  listings: null
}

function reducer(state = INITIAL_STATE, action) {
  switch(action.type) {
    case 'SET_LISTINGS':
      return {
        ...state,
        listings: action.payload
      }
      default: 
      return state;
  }
}

export default reducer;