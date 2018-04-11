import { Story } from '../types';

export function storiesReducer(state: Story[] = [], action): Story[] {
    if (action.type === 'SET_STORIES') return action.stories;
    if (action.type === 'ADD_STORY') return [action.story, ...state];
    if (action.type === 'REMOVE_STORY') {
        return state.filter(story => story._id !== action._id);
    }
    if (action.type === 'ADD_COMMENT') {
        return state.map(story => {
            if (story._id !== action._id) return story;
            return { ...story, comments: [action.comment, ...story.comments] };
        });
    }
    return state;
}
