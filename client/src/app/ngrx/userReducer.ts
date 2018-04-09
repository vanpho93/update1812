export function userReducer(state = null, action) {
    if (action.type === 'SET_USER') return action.user;
    if (action.type === 'SIGN_OUT') return null;
    return state;
}
