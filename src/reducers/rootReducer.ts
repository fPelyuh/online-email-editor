import { combineReducers } from 'redux';
import templates, { TemplatesState } from './templates';

export interface AppState {
    templates: TemplatesState;
}

export default combineReducers<AppState>({
    templates
});
