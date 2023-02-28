interface fileParams {
    fileData: any;
    fileName?: string;
}

export const downloadTextFile = ({ fileData, fileName }: fileParams) => {
    const blob = new Blob([JSON.stringify(fileData)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName ? fileName : 'unnamed.txt';
    link.href = url;
    link.click();
};
