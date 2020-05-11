const clickHandler = () => {
    const endpoint = document.getElementById('endpoint').value.toLowerCase() || '/api/';
    const method = document.getElementById('method').value.toUpperCase() || 'GET';
    const payload = document.getElementById('payload').value.trim();
    const shouldEvalOrParse = (string) => ['{', '['].includes(string[0])
        && ['}', ']'].includes(string[string.length - 1]);
    const evaluatedPayload = shouldEvalOrParse(payload) ? eval(`(${payload})`) : payload;
    const request = {
        headers: { 'Content-type': shouldEvalOrParse(payload) ? 'application/json' : 'text/plain' },
        method,
        ...method !== 'GET' && { body: JSON.stringify(evaluatedPayload)},
    };

    fetch(endpoint, request)
    .then(data => data.text())
    .then(data => {
        const output = document.getElementById('output');

        if(shouldEvalOrParse(data)) {
            const parsedData = JSON.parse(data)
            output.textContent = JSON.stringify(parsedData, null, 2);
        }
        else output.textContent = data;
    })
};

document.getElementById('button').addEventListener('click', clickHandler)
