import { User } from '../types';

export function friendsReducer(state: User[] = [], action) {
    if (action.type === 'SET_ALL_USER') return action.friends;
    if (action.type === 'ACCEPT_FRIEND') return [action.user, ...state];
    if (action.type === 'REMOVE_FRIEND') return state.filter(user => user._id !== action.user._id);
    return state;
}

export function sentRequestsReducer(state: User[] = [], action) {
    if (action.type === 'SET_ALL_USER') return action.sentRequests;
    if (action.type === 'SEND_REQUEST') return [action.user, ...state];
    return state;
}

export function incommingRequestsReducer(state: User[] = [], action) {
    if (action.type === 'SET_ALL_USER') return action.incommingRequests;
    if (action.type === 'ACCEPT_FRIEND') return state.filter(user => user._id !== action.user._id);
    return state;
}

export function otherUsersReducer(state: User[] = [], action) {
    if (action.type === 'SET_ALL_USER') return action.otherUsers;
    if (action.type === 'SEND_REQUEST') return state.filter(user => user._id !== action.user._id);
    if (action.type === 'REMOVE_FRIEND') return [action.user, ...state];
    return state;
}
