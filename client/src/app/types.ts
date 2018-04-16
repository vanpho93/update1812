export interface Comment {
    _id: string;
    user: {
        _id: string;
        name: string;
    }
}

export interface Story {
    _id: string;
    comments: Comment[];
    author: {
        name: string;
    }
}

export interface User {
    _id: string;
    email: string;
    name: string;
}

export interface AppState {
    user: User;
    stories: Story[];
    friends: User[];
    incommingRequests: User[];
    sentRequests: User[];
    otherUsers: User[];
}
