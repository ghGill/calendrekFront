import './Confirm.css'

type confirmParams = {
    text:string,
    yesText?:string,
    noText?:string,
    callback: CallableFunction,
}

function Confirm({text, yesText='כן', noText='לא', callback}:confirmParams) {
    return (
        <div className="confirm-wrapper">
            <div className="confirm-bg">
                <div className='title'>
                    <label>{text}</label>
                </div>
                <div className='buttons'>
                    <button type='button' onClick={() => {callback(false)}}>{noText}</button>
                    <button type='button' onClick={() => {callback(true)}}>{yesText}</button>
                </div>
            </div>
        </div>
    )
}

export default Confirm;
