import React, { useState } from 'react';
import './Numberformat.css';
import numberToWords from 'number-to-words';

export default function Numberformat() {
  const [inputFormat, setInputFormat] = useState('decimal');
  const [inputNumber, setInputNumber] = useState('');
  const [decimal, setDecimal] = useState('');
  const [integer, setInteger] = useState('');
  const [binary, setBinary] = useState('');
  const [octal, setOctal] = useState('');
  const [hexadecimal, setHexadecimal] = useState('');
  const [roundDigit, setRoundDigit] = useState('');
  const [rounddigitindex, setRounddigitindex] = useState('2');
  const [significantno, setSignificantno] = useState('');
  const [significantnoindex, setSignificantnoindex] = useState('2');
  const [numerator, setNumerator] = useState('0');
  const [denominator, setDenominator] = useState('0');
  const [inword, setInword] = useState('');

  const handleConversion = () => {
    let decimalValue;

    try {
      switch (inputFormat) {
        case 'binary':
          decimalValue = parseInt(inputNumber, 2);
          break;
        case 'octal':
          decimalValue = parseInt(inputNumber, 8);
          break;
        case 'hexadecimal':
          decimalValue = parseInt(inputNumber, 16);
          break;
        default:
          decimalValue = parseFloat(inputNumber);
      }

      if (isNaN(decimalValue)) {
        alert('Please enter a valid number');
        return;
      }

      const intVal = Math.floor(decimalValue);

      setDecimal(decimalValue);
      setInteger(intVal);
      setBinary(intVal.toString(2));
      setOctal(intVal.toString(8));
      setHexadecimal(intVal.toString(16).toUpperCase());

      // Sayıyı yazıyla yazma
      if (decimalValue <= 1e15) {
        const word = intVal < 0 
          ? `minus ${numberToWords.toWords(Math.abs(intVal))}` 
          : numberToWords.toWords(intVal);
        setInword(word);
      } else {
        setInword('Over Limit (Max-Limit : 1,000,000,000,000,000)');
      }

      setRoundDigit(roundToKthInteger(decimalValue, parseInt(rounddigitindex)));
      setSignificantno(roundToSignificantDigits(decimalValue, parseInt(significantnoindex)));

      // Kesirli kısım
      const fractionPart = decimalValue - intVal;
      if (fractionPart !== 0) {
        const result = floatToFraction(fractionPart);
        setNumerator(result.numerator);
        setDenominator(result.denominator);
      } else {
        setNumerator('0');
        setDenominator('0');
      }
    } catch (error) {
      alert('There is a problem');
      console.error(error);
    }
  };

  function floatToFraction(number) {
    const tolerance = 0.000001;
    let numerator = 1;
    let denominator = 1;
    let error = number - numerator / denominator;

    while (Math.abs(error) > tolerance) {
      if (error > 0) {
        numerator++;
      } else {
        denominator++;
      }
      error = number - numerator / denominator;
    }

    return { numerator, denominator };
  }

  function roundToKthInteger(number, k) {
    const multiplier = Math.pow(10, k);
    return Math.round(number * multiplier) / multiplier;
  }

  function roundToSignificantDigits(number, digits) {
    if (digits <= 0 || number === 0) return 0;
    const multiplier = Math.pow(10, digits - Math.floor(Math.log10(Math.abs(number))) - 1);
    return Math.round(number * multiplier) / multiplier;
  }

  return (
    <div className="application">
      <h1>Number Format Converter</h1>

      <div className="section">
        <div className="row">
          <label>From</label>
          <select value={inputFormat} onChange={(e) => setInputFormat(e.target.value)}>
            <option value="binary">Binary</option>
            <option value="decimal">Decimal</option>
            <option value="octal">Octal</option>
            <option value="hexadecimal">Hexadecimal</option>
          </select>
        </div>

        <div className="row">
          <label>Enter {inputFormat} Number</label>
          <input
            type={inputFormat === 'decimal' ? 'number' : 'text'}
            value={inputNumber}
            onChange={(e) => setInputNumber(e.target.value)}
          />
          <button onClick={handleConversion}>Convert</button>
        </div>

        <div className="row">
          <label>Integer Number</label>
          <input type="number" value={integer} readOnly />
        </div>

        <div className="row">
          <label>Significant Number</label>
          <div>
            <input type="number" value={significantno} readOnly />
            <select value={significantnoindex} onChange={(e) => setSignificantnoindex(e.target.value)}>
              {[...Array(9).keys()].map((v) => (
                <option key={v + 1} value={v + 1}>{v + 1}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          <label>Rounded Number</label>
          <div>
            <input type="number" value={roundDigit} readOnly />
            <select value={rounddigitindex} onChange={(e) => setRounddigitindex(e.target.value)}>
              {[...Array(10).keys()].map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="row">
          <label>Fraction</label>
          <div>
            <input type="number" value={integer} readOnly />
            <input type="number" value={numerator} readOnly />
            <span>/</span>
            <input type="number" value={denominator} readOnly />
          </div>
        </div>

        <div className="row">
          <label>Binary Format (Base-2)</label>
          <input type="text" value={binary} readOnly />
        </div>

        <div className="row">
          <label>Octal Format (Base-8)</label>
          <input type="text" value={octal} readOnly />
        </div>

        <div className="row">
          <label>Hexadecimal Format (Base-16)</label>
          <input type="text" value={hexadecimal} readOnly />
        </div>

        <div className="row">
          <label>In Words</label>
          <input type="text" value={inword} readOnly />
        </div>
      </div>
    </div>
  );
}
