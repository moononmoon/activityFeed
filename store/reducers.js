import { ADD_FEED, UPDATE_ACTIVITY, DELETE_ACTIVITY } from './actions';
import Feed from '../Screens/feeds';
const initialState = {
    activities: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_FEED:
            const existingIndex = state.activities.findIndex(feed => feed.id === action.feedData.id);
            const updatedFeeds = [];
                updatedFeeds.push(new Feed(
            action.feedData.id,
            action.feedData.username, 
            action.feedData.message, 
            action.feedData.imageUri
            ));
            return {
                ...state,
                activities: (existingIndex !== -1) ? state.activities : state.activities.concat(updatedFeeds)
            };
        case UPDATE_ACTIVITY:
        const existingActIndex = state.activities.findIndex(fed => fed.id === action.updateData.id);
        const updatedFeed = new Feed(
            action.updateData.id, 
            action.updateData.username,
            action.updateData.message,
            action.updateData.imageUri
        );
        const newUpdatedFeed = [...state.activities];
        newUpdatedFeed[existingActIndex] = updatedFeed;
        return {
            ...state,
            activities: newUpdatedFeed
        };
        case DELETE_ACTIVITY:
            return {
                ...state,
                activities: state.activities.filter(feed => feed.id !== action.deleteData.id),
            }
    }
    return state;
};