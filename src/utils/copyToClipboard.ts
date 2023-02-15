const copyToClipboard = (text: string) => {
    if (!navigator.clipboard) {
        alert('Буфер обмена не найден')
        return;
    }
    return navigator.clipboard.writeText(text).then(
        function() {
            return true;
        },
        function() {
            return false;
        }
    );
};

export default copyToClipboard;