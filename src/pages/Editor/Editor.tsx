import React, { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react';
import EmailEditor, { HtmlExport } from 'react-email-editor';
import styles from '../../constants/App.module.scss';
import copyToClipboard from '../../utils/copyToClipboard';
import ActionButtons from '../../components/ActionButton/ActionButtons';
import { useDispatch, useSelector } from 'react-redux';
import { templatesListSave } from '../../reducers/templates';
import { EmailTemplate } from '../../constants/types';
import { AppState } from '../../reducers/rootReducer';

const AUTO_SAVE_DURATION = 1000 * 60;

const Editor: FunctionComponent = () => {
    const dispatch = useDispatch();
    const { templatesList } = useSelector((state: AppState) => state.templates);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [successCode, setSuccessCode] = useState<number>(0);
    const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | undefined>();
    const emailEditorRef = useRef(null);

    const loadTemplate = useCallback(async () => {
        const templateId = window.location.search.replace('?', '').split('=')[1];
        const foundedTemplate = await templatesList.find((template) => template.id === templateId);
        setCurrentTemplate(foundedTemplate);
    }, [templatesList]);

    const updateTemplate = useCallback(
        async (nextState: EmailTemplate) => {
            await dispatch(templatesListSave(nextState));
            setCurrentTemplate(nextState);
        },
        [dispatch]
    );

    useEffect(() => {
        loadTemplate().finally(() => {
            setLoading(false);
        });
    }, [currentTemplate?.design, loadTemplate]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!emailEditorRef.current || !currentTemplate) {
                return;
            }
            // todo устранить ошибки с emailEditorRef.current?.editor
            // @ts-ignore
            emailEditorRef.current?.editor.exportHtml((data: HtmlExport) => {
                const { design, html } = data;
                const nextTemplate: EmailTemplate = { ...currentTemplate, design, html };
                updateTemplate(nextTemplate).finally();
            });
        }, AUTO_SAVE_DURATION);
        return () => {
            clearInterval(intervalId);
        };
    }, [currentTemplate, dispatch, updateTemplate]);

    const onCopy = useCallback((string: string) => {
        copyToClipboard(string)
            ?.then(() => setSuccessCode(1))
            .catch(() => setSuccessCode(2))
            .finally(() => {
                const timeoutId = setTimeout(() => {
                    setSuccessCode(0);
                    clearTimeout(timeoutId);
                }, 3000);
            });
    }, []);

    const exportHtml = () => {
        if (!emailEditorRef.current || !currentTemplate) {
            return;
        }
        // @ts-ignore
        emailEditorRef.current.editor.exportHtml((data: HtmlExport) => {
            const { html } = data;
            onCopy(html);
            const nextTemplate: EmailTemplate = { ...currentTemplate, html };
            updateTemplate(nextTemplate).finally(() => setCurrentTemplate(nextTemplate));
        });
    };

    const onSave = () => {
        if (!emailEditorRef.current || !currentTemplate) {
            return;
        }
        // @ts-ignore
        emailEditorRef.current.editor.exportHtml((data: HtmlExport) => {
            const { design, html } = data;
            const nextTemplate: EmailTemplate = { ...currentTemplate, design, html };
            updateTemplate(nextTemplate).finally(() => setCurrentTemplate(nextTemplate));
        });
    };

    const onReady = () => {
        if (!emailEditorRef.current) {
            return;
        }
        // @ts-ignore
        emailEditorRef.current.editor.loadDesign(currentTemplate?.design);
    };

    if (isLoading) {
        return <div>Загрузка</div>;
    }

    if (!isLoading && !currentTemplate) {
        return <div>Шаблон не найден</div>;
    }

    return (
        <div className={styles.wrapper}>
            <ActionButtons
                currentTemplate={currentTemplate}
                successCode={successCode}
                onExportHtml={exportHtml}
                onSave={onSave}
            />
            <EmailEditor
                onReady={onReady}
                ref={emailEditorRef}
                minHeight={`100vh`}
                style={{ width: '100vw', zIndex: 0 }}
            />
        </div>
    );
};

export default Editor;
