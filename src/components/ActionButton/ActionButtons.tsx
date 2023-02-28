import React, { FunctionComponent, useState } from 'react';
import styles from './ActionButtons.module.scss';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import AppRoute from '../../constants/AppRoute';
import { EmailTemplate } from '../../constants/types';

interface Props {
    successCode: number;
    currentTemplate?: EmailTemplate;
    onExportHtml(): void;
    onSave(): void;
}

const ActionButtons: FunctionComponent<Props> = ({ successCode, currentTemplate, onExportHtml, onSave }) => {
    const [isOpen, setOpen] = useState<boolean>(false);

    const toggleOpen = () => {
        setOpen(!isOpen);
    };

    const download = () => {
        if (!currentTemplate) {
            return;
        }
        const fileData = JSON.stringify(currentTemplate);
        const blob = new Blob([fileData], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `template-${currentTemplate.title}-${currentTemplate.id}.json`;
        link.href = url;
        link.click();
    };
    return (
        <div className={classNames(styles.actionButtons, { [styles.isOpen]: isOpen })}>
            <div className={styles.toggleWrapper}>
                <div
                    className={classNames(
                        styles.toggleButton,
                        { [styles.success]: successCode === 1 },
                        { [styles.error]: successCode === 2 }
                    )}
                    onClick={toggleOpen}
                />

                <div className={styles.transparent}></div>
            </div>

            <Link className={styles.exportButton} to={AppRoute.ROOT}>
                Назад
            </Link>
            <button className={styles.exportButton} onClick={onSave}>
                Сохранить
            </button>
            <button className={styles.exportButton} onClick={onExportHtml}>
                Скопировать HTML
            </button>
            <button className={styles.exportButton} onClick={download}>
                Скачать JSON шаблона
            </button>
        </div>
    );
};

export default ActionButtons;
