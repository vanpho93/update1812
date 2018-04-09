export function loadingReducer(state = true, action) {
    if (action.type === 'LOADED') return false;
    return state;
}
