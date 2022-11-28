const connection = new signalR.HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.None)
    .withUrl('/converter')
    .build();

connection.on('Receive', data => {
    let paragraph = document.createElement('p');
    paragraph.innerHTML = data;
    
    document.getElementById('container').appendChild(paragraph);
});

connection.start();

const currencyList = ['USD', 'EUR', 'RUB'];
const lengthList = ['m', 'km', 'ft', 'in', 'mi'];
const weightList = ['g', 'kg', 'lb'];

const lengthConverter = {
    'm': 1,
    'km': 1000,
    'in': 39.37,
    'ft': 3.28,
    'mi': 1609.344
}

const weightConverter = {
    'g': 1,
    'kg': 1000,
    'lb': 450
}

let measureList = currencyList;
let converter = lengthConverter;

let measureFrom = 0;
let measureTo = 1;
let valueFrom = 0;
let valueTo = 0;

// ================ HANDLE CHANGE

// radio change
const radioChange = (element) => {
    let value = element.value;
    
    if (value === 'currency') {
        measureList = currencyList;
    } else if (value === 'length') {
        measureList = lengthList;
        converter = lengthConverter;
    } else {
        measureList = weightList;
        converter = weightConverter;
    }

    measureFrom = 0;
    measureTo = 1;
    valueFrom = 0;
    valueTo = 0;
    
    document.getElementById('from-value').value = valueFrom;
    document.getElementById('to-value').value = '';
    selectSwitchOptions();
}

// select handlers
const selectSwitchOptions = () => {
    let elements = [...document.getElementsByClassName('measure-select')];
    
    elements.forEach((element, elementIndex) => {
        element.innerHTML = '';
        
        measureList.forEach((value, index) => {
            let option = document.createElement('option');
            option.innerHTML = value;
            option.value = `measure${elementIndex}${index}`;
            
            if (elementIndex === 0) {
                if (index === measureFrom)
                    option.selected = true;
            } else if (elementIndex === 1) {
                if (index === measureTo)
                    option.selected = true;
            }
            
            element.appendChild(option);
        });
    });
}
selectSwitchOptions();

// from value
const fromInput = () => {
    valueFrom = document.getElementById('from-value').value;
}
const fromChange = () => {
    if (valueFrom === '' || isNaN(valueFrom)) {
        valueFrom = 0;
        document.getElementById('from-value').value = 0;
    }
}

// to value
const toInput = () => {
    valueTo = document.getElementById('to-value').value;
}

// from measure
const fromMeasureChange = () => {
    let optionId = document.getElementById('from-measure').value;
    measureFrom = optionId[optionId.length - 1];
}

// to measure
const toMeasureChange = () => {
    let optionId = document.getElementById('to-measure').value;
    measureTo = optionId[optionId.length - 1];
}

// ================ HANDLE REQUESTS

const convertValue = async () => {    
    if (valueFrom === 0) {
        valueTo = 0;
        return;
    }
    
    if (measureList === currencyList)
    {
        console.log(measureTo, measureFrom);
        const response = await axios.get(`https://api.apilayer.com/fixer/convert?to=${measureList[measureTo]}`
            + `&from=${measureList[measureFrom]}&amount=${valueFrom}`,
            {
                headers: {
                    'apikey': 'x76P3mjhsMGFALiVLchksELLLKQ9ZzTw'
                }
            });
        
        valueTo = await response.data.result;
        document.getElementById('to-value').value = valueTo;
        return;
    }

    valueTo = converter[measureList[measureFrom]] / converter[measureList[measureTo]] * valueFrom;
    document.getElementById('to-value').value = valueTo;
}

const sendData = async () => {
    const response = await axios.post(`/send-data?measureFrom=${measureList[measureFrom]}&`
                                + `measureTo=${measureList[measureTo]}&valueFrom=${valueFrom}&`
                                + `valueTo=${valueTo}`);
    return response.data.success;
}

const convertAndSend = async () => {
    await convertValue();
    let success = await sendData();
    
    console.log(success);
    
    if (success)
        await connection.invoke('Send', 
            `${valueFrom} ${measureList[measureFrom]} = ${valueTo} ${measureList[measureTo]}`
        );
}