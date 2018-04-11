export function storiesReducer(state = [], action) {
    if (action.type === 'SET_STORIES') return action.stories;
    if (action.type === 'ADD_STORY') return [action.story, ...state];
    return state;
}
