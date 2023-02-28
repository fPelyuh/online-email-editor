import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { actionCreator } from './helpers';
import { EmailTemplate } from '../constants/types';

export interface TemplatesState {
    templatesList: EmailTemplate[];
}

const initialState: TemplatesState = {
    templatesList: []
};

export const templatesListLoader = actionCreator<EmailTemplate[]>('TEMPLATES_LIST_LOADER');
export const templatesListSave = actionCreator<EmailTemplate>('TEMPLATES_LIST_SAVE');

export default reducerWithInitialState(initialState)
    .case(templatesListLoader, (state, templatesList) => {
        // eslint-disable-next-line no-console
        console.debug('localStorage loaded');
        localStorage.setItem('templates', JSON.stringify(templatesList));
        return { ...state, templatesList: templatesList };
    })
    .case(templatesListSave, (state, emailTemplate) => {
        const nextList = state.templatesList.map((template) => {
            if (template.id !== emailTemplate.id) {
                return template;
            }
            return emailTemplate;
        });
        // eslint-disable-next-line no-console
        console.debug('localStorage updated');
        localStorage.setItem('templates', JSON.stringify(nextList));
        return { ...state, templatesList: nextList };
    });
