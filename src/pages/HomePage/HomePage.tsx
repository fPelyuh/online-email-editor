import React, { FunctionComponent, useState } from 'react';
import styles from './HomePage.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../reducers/rootReducer';
import { templatesListLoader } from '../../reducers/templates';
import { EmailTemplate } from '../../constants/types';
import { defaultTemplate } from '../../constants/defaultTemplate';
import classNames from 'classnames';
import TemplateCard from '../../components/TemplateCard/TemplateCard';
import { downloadTextFile } from '../../utils/downloadFile';

export enum Params {
    ID = 'id',
    TITLE = 'title'
}

const today = new Date().toLocaleDateString();
const time = new Date().toLocaleTimeString('RU-ru', { timeStyle: 'short' });

const HomePage: FunctionComponent = () => {
    const dispatch = useDispatch();
    const [disabled, setDisabled] = useState<boolean>(true);
    const [newTemplate, setNewTemplate] = useState<EmailTemplate>(defaultTemplate);
    const { templatesList } = useSelector((state: AppState) => state.templates);

    const changeInput = (type: Params) => (event: any) => {
        const {
            target: { value }
        } = event;
        const newTemplateState = { ...newTemplate, [type]: type === Params.ID ? value.replaceAll(' ', '') : value };
        const { title, id } = newTemplateState;
        const templatesIds = templatesList.map((template) => template.id);

        if (!title || !id || templatesIds.includes(id)) {
            setDisabled(true);
        } else {
            setDisabled(false);
        }

        setNewTemplate(newTemplateState);
    };

    const downloadStore = () => {
        downloadTextFile({ fileData: templatesList, fileName: `templatesStore-${today}-${time}.json` });
    };

    const createNewTemplate = () => {
        const { title, id } = newTemplate;
        const templatesIds = templatesList.map((template) => template.id);
        if (!title || !id || templatesIds.includes(id)) {
            return;
        }
        dispatch(templatesListLoader([...templatesList, newTemplate]));
        setDisabled(true);
        setNewTemplate(defaultTemplate);
    };

    return (
        <div className={styles.homePage}>
            {templatesList.length !== 0 && (
                <>
                    {' '}
                    <div className={styles.actionButtons}>
                        <div
                            className={classNames(styles.actionButton, styles.clear)}
                            onClick={() => {
                                dispatch(templatesListLoader([]));
                                localStorage.setItem('templates', JSON.stringify([]));
                            }}
                        >
                            Очистить хранилище
                        </div>
                        <div className={styles.actionButton} onClick={downloadStore}>
                            Выгрузить данные хранилища
                        </div>
                        <div className={classNames(styles.actionButton, styles.disabled)}>
                            Загрузить данные в хранилище
                        </div>
                    </div>
                    <div className={styles.title}>Шаблоны</div>
                    <div className={styles.templatesList}>
                        {templatesList.map((template) => (
                            <TemplateCard key={template.id} emailTemplate={template} />
                        ))}
                    </div>
                </>
            )}

            <div className={styles.form}>
                <input
                    onChange={changeInput(Params.ID)}
                    placeholder="Id"
                    className={styles.input}
                    value={newTemplate.id}
                    type="text"
                />
                <input
                    onChange={changeInput(Params.TITLE)}
                    placeholder="Название шаблона"
                    className={styles.input}
                    value={newTemplate.title}
                    type="text"
                />
            </div>
            <div className={classNames(styles.newButton, { [styles.disabled]: disabled })} onClick={createNewTemplate}>
                Создать новый шаблон
            </div>
        </div>
    );
};

export default HomePage;
