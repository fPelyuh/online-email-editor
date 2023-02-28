import React, { FunctionComponent, useState } from 'react';
import styles from './TemplateCardModal.module.scss';
import { EmailTemplate } from '../../constants/types';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { templatesListLoader, templatesListSave } from '../../reducers/templates';
import { Params } from '../../pages/HomePage/HomePage';
// @ts-ignore
import { ReactComponent as CloseIcon } from './../../img/closeIcon.svg';

interface Props {
    emailTemplate: EmailTemplate;
    templatesList: EmailTemplate[];
    onClose(): void;
}

enum ActionType {
    EDIT = 'EDIT',
    DELETE = 'DELETE'
}

const TemplateCardModal: FunctionComponent<Props> = ({ emailTemplate, templatesList, onClose }) => {
    const dispatch = useDispatch();
    const [notificationType, setNotificationType] = useState<ActionType | undefined>();
    const [disabled, setDisabled] = useState<boolean>(true);
    const [updatedTemplate, setTemplate] = useState<EmailTemplate>(emailTemplate);
    const templatesIds = templatesList.map((template) => template.id);

    const handleChange = (type: Params) => (event: any) => {
        const {
            target: { value }
        } = event;
        const newTemplateState = { ...updatedTemplate, [type]: type === Params.ID ? value.replaceAll(' ', '') : value };
        const { id, title } = newTemplateState;

        setTemplate(newTemplateState);
        switch (type) {
            case Params.ID:
                if (!id || id === emailTemplate.id || templatesIds.includes(id)) {
                    setDisabled(true);
                } else {
                    setDisabled(false);
                }
                return;
            case Params.TITLE:
                if (!id || !title || title === emailTemplate.title) {
                    setDisabled(true);
                } else {
                    setDisabled(false);
                }
                return;
        }
    };

    const addNotificationModal = (type: ActionType | undefined) => () => {
        setNotificationType(type);
    };

    const handleEdit = () => {
        if (updatedTemplate.id === emailTemplate.id) {
            dispatch(templatesListSave(updatedTemplate));
        }
        const filtered = templatesList.filter((template) => template.id !== emailTemplate.id);
        const nextList = [...filtered, updatedTemplate];
        dispatch(templatesListLoader(nextList));
    };

    const handleDelete = () => {
        const filteredList = templatesList.filter((template) => template.id !== emailTemplate.id);
        dispatch(templatesListLoader(filteredList ? filteredList : []));
    };

    const handleSubmit = () => {
        if (notificationType === ActionType.DELETE) {
            handleDelete();
            onClose();
            return;
        }
        if (notificationType === ActionType.EDIT) {
            handleEdit();
            onClose();
            return;
        }
    };

    return (
        <>
            <div className={styles.background}>
                {notificationType ? (
                    <div className={classNames(styles.modal, styles.notification)}>
                        <div className={styles.notificationTitle}>
                            Уверены, что хотите {notificationType === ActionType.DELETE ? 'удалить' : 'сохранить'}{' '}
                            шаблон
                        </div>
                        <div onClick={handleSubmit} className={classNames(styles.notificationButton, styles.green)}>
                            Да
                        </div>
                        <div
                            onClick={addNotificationModal(undefined)}
                            className={classNames(styles.notificationButton, styles.red)}
                        >
                            Нет
                        </div>
                    </div>
                ) : (
                    <div className={styles.modal}>
                        <CloseIcon className={styles.close} onClick={onClose} />
                        <div className={styles.title}>Редактирование {emailTemplate.id}</div>
                        <input
                            className={styles.input}
                            onChange={handleChange(Params.TITLE)}
                            value={updatedTemplate.title}
                        />
                        <input className={styles.input} onChange={handleChange(Params.ID)} value={updatedTemplate.id} />
                        <div className={styles.buttonsWrapper}>
                            <div
                                onClick={addNotificationModal(ActionType.EDIT)}
                                className={classNames(styles.button, styles.green, { [styles.disabled]: disabled })}
                            >
                                Сохранить
                            </div>
                            <div
                                onClick={addNotificationModal(ActionType.DELETE)}
                                className={classNames(styles.button, styles.red)}
                            >
                                Удалить
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default TemplateCardModal;
