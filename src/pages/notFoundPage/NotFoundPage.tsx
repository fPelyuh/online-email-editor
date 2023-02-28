import React, { FunctionComponent } from 'react';
import styles from './NotFoundPage.module.scss';

const NotFoundPage: FunctionComponent = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <div>
                    <h2 className={styles.header}>Что-то пошло не так</h2>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
