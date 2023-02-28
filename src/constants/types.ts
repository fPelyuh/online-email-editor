import { Design } from 'react-email-editor';

export interface EmailTemplate {
    id: string;
    title: string;
    design: Design;
    html?: string;
}
