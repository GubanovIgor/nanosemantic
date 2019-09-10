import React, { Component } from 'react';
import style from '../stylesheets/message.module.css'

const Message = (props) => {
    const botMessage = {
        maxWidth: '45%',
        borderRadius: '15px',
        padding: '20px 0',
        backgroundColor: 'rgb(248, 255, 181)',
        margin: '0 0 5px auto',
    }

    const clientMessage = {
        maxWidth: '45%',
        borderRadius: '15px',
        padding: '20px 0',
        backgroundColor: 'rgb(181, 255, 245)',
        margin: '0 auto 5px 0',
    }

    return(
        <div className={style.messageContainer}>
            {(props.index % 2 != 0) ?
                <div style={botMessage}>{props.text}</div> :
                <div style={clientMessage}>{props.text}</div>
            }
        </div>
    )
}

export default Message;