export function friendsReducer(state = [], action) {
    if (action.type === 'SET_ALL_USER') return action.friends;
    return state;
}
export function sentRequestsReducer(state = [], action) {
    if (action.type === 'SET_ALL_USER') return action.sentRequests;
    return state;
}
export function incommingRequestsReducer(state = [], action) {
    if (action.type === 'SET_ALL_USER') return action.incommingRequests;
    return state;
}
export function otherUsersReducer(state = [], action) {
    if (action.type === 'SET_ALL_USER') return action.otherUsers;
    return state;
}
