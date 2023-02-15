import React, { useEffect, useRef, useState } from 'react';
import EmailEditor, { HtmlExport } from 'react-email-editor';
import styles from './constants/App.module.scss';
import copyToClipboard from './utils/copyToClipboard';
import { defaultJSON } from './constants/defaultJSON';

const MIN_WIDTH_FOR_WORK = 1024;

const App = () => {
    const [isSmall, setSmall] = useState<boolean>(false);
    const [isReady, setReady] = useState<boolean>(false);
    const emailEditorRef = useRef(null);

    const windowSizeCheck = () => {
        setSmall(window.innerWidth < MIN_WIDTH_FOR_WORK);
        setReady(false);
    };

    useEffect(() => {
        window.addEventListener('resize', windowSizeCheck);
        return () => window.removeEventListener('resize', windowSizeCheck);
    }, []);
    const exportHtml = () => {
        if (!emailEditorRef.current) {
            return;
        }
        // @ts-ignore
        emailEditorRef.current.editor.exportHtml((data: HtmlExport) => {
            const { html } = data;
            copyToClipboard(html);
        });
    };

    const onLoad = () => {
        if (!emailEditorRef.current) {
            return;
        }
        // @ts-ignore
        emailEditorRef.current.editor.loadDesign(defaultJSON);
    };

    const onReady = () => {
        // eslint-disable-next-line no-console
        setReady(true);
    };

    if (isSmall) {
        return <div className={styles.warningMessage}>Слишком маленькое разрешение для комфортной работы</div>;
    }

    return (
        <div className={styles.wrapper}>
            <EmailEditor
                ref={emailEditorRef}
                onLoad={onLoad}
                onReady={onReady}
                minHeight={`100vh`}
                style={{ width: '100vw' }}
            />

            {isReady && (
                <div className={styles.buttons}>
                    <button className={styles.exportButton} onClick={exportHtml}>
                        Скопировать HTML
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;
