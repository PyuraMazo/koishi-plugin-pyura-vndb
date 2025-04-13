import { HandleOutput, argSet } from "./handleOutput"


export function autoConn(_argSet: argSet, _singleObj: object) {
    const ho = new HandleOutput();
    let str = "";

    _argSet.kindKey2Value.forEach(v => {
        if (!_singleObj[_argSet.argSourceArr[v]]) {
            return;
        }
        str += `${_argSet.argChsArr[v]}：${String(_singleObj[_argSet.argSourceArr[v]])}\n`
    })  

    _argSet.kindkey2Arr.forEach(v => {
        if (_singleObj[_argSet.argSourceArr[v]].length === 0) {
            return;
        }
        str += `${_argSet.argChsArr[v]}：${String(ho.outputWholeArr(_singleObj[_argSet.argSourceArr[v]], _argSet.argConnSymbol))}\n`
    })

    return str;
}