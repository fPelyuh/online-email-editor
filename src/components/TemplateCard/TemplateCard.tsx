import React, { FunctionComponent, useState } from 'react';
import styles from './TemplateCard.module.scss';
import { EmailTemplate } from '../../constants/types';
import AppRoute from '../../constants/AppRoute';
import { Link } from 'react-router-dom';
import { downloadTextFile } from '../../utils/downloadFile';
import copyToClipboard from '../../utils/copyToClipboard';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { AppState } from '../../reducers/rootReducer';
import TemplateCardModal from '../TemplateCardModal/TemplateCardModal';

interface Props {
    emailTemplate: EmailTemplate;
}

const TemplateCard: FunctionComponent<Props> = ({ emailTemplate }) => {
    const { templatesList } = useSelector((state: AppState) => state.templates);
    const [isOpenModal, setOpenModal] = useState<boolean>(false);

    const downloadJSON = () => {
        downloadTextFile({
            fileData: emailTemplate,
            fileName: `template-${emailTemplate.title}-${emailTemplate.id}.json`
        });
    };
    const copyHTML = () => {
        copyToClipboard(JSON.stringify(emailTemplate.html));
    };

    const toggleModal = () => {
        setOpenModal(!isOpenModal);
    };

    return (
        <>
            <div className={styles.templateLink}>
                <div className={styles.backgroundId}>{emailTemplate.id}</div>
                <div className={styles.title}>{emailTemplate.title}</div>
                <Link className={styles.button} to={AppRoute.TEMPLATE + `?templateId=` + emailTemplate.id}>
                    Редактировать шаблон
                </Link>
                {emailTemplate.html && (
                    <div className={styles.button} onClick={copyHTML}>
                        Скопировать HTML
                    </div>
                )}
                <div className={styles.button} onClick={downloadJSON}>
                    Скачать JSON
                </div>
                <div className={classNames(styles.button, styles.edit)} onClick={toggleModal}>
                    Править карточку
                </div>
            </div>
            {isOpenModal && (
                <TemplateCardModal emailTemplate={emailTemplate} templatesList={templatesList} onClose={toggleModal} />
            )}
        </>
    );
};

export default TemplateCard;
