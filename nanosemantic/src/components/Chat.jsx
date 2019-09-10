import React, { Component } from 'react';
import style from '../stylesheets/chat.module.css';
import Message from './Message';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      clientMessage: '',
      uuid: '772c9859-4dd3-4a0d-b87d-d76b9f43cfa4',
      cuid: '',
    }
  }

  componentDidMount = async () => {
    const euid = '00b2fcbe-f27f-437b-a0d5-91072d840ed3';

    const resp1 = await fetch(`https://biz.nanosemantics.ru/api/2.1/json/Chat.init`, {
      method: 'POST',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(this.state.uuid),
    })
    const cuid = await resp1.json();
    this.setState({ cuid: cuid.result.cuid });

    const welcome = {
      cuid: cuid.result.cuid,
      euid: euid,
    }
    const resp2 = await fetch(`https://biz.nanosemantics.ru/api/2.1/json/Chat.event`, {
      method: 'POST',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(welcome),
    })
    const welcomeMessage = await resp2.json();
    this.setState({
      history: [...this.state.history, welcomeMessage.result.text.value],
    });
  }

  changeInputContent = async (e) => {
    await this.setState({ clientMessage: e.target.value });
  }

  submit = async () => {
    const chatRequest = {
      cuid: this.state.cuid,
      text: this.state.clientMessage,
    }
    const resp = await fetch(`https://biz.nanosemantics.ru/api/2.1/json/Chat.request`, {
      method: 'POST',
      header: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(chatRequest),
    })
    const data = await resp.json();
    this.setState({
      history: [...this.state.history, this.state.clientMessage, data.result.text.value],
    });

    let chatWindow = this.refs.chatWindow;
    chatWindow.scrollTop = 2**99; // нормального решения не придумал
  }

  render() {
    return (
      <div>
        <div className={style.chat} ref='chatWindow'>
          {this.state.history.map((el, index) => {
            return <Message text={el} key={index} index={index}/>
          })}
        </div>
        <div className={style.messageContainer}>
          <input onChange={this.changeInputContent} className={style.input_chat}></input>
          <button onClick={this.submit} className={style.buttonSubmit_chat}>Отправить</button>
        </div>
      </div>
    )
  }
}

export default Chat;
